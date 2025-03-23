import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.ACCOUNT_ID!}.eu.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ID_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

export async function GET(request: NextRequest) {
  // Get pagination parameters from URL
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const latest = searchParams.get("latest") === "true";

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Get total count for pagination headers
  const total = await prisma.webtoon.count();

  // Get paginated webtoons
  const webtoons = await prisma.webtoon.findMany({
    skip,
    take: limit,
    ...(latest && { orderBy: { createdAt: 'desc' } }),
  });

  // Generate presigned URLs for cover images
  const webtoonsWithSignedUrls = await Promise.all(
    webtoons.map(async (webtoon) => {
      if (webtoon.coverImage) {
        const key = webtoon.coverImage.split('/').pop(); // Get filename from URL
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: `webtoon-covers/${key}`,
        });
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return { ...webtoon, coverImage: signedUrl };
      }
      return webtoon;
    })
  );

  // Create response with pagination headers
  const response = new Response(JSON.stringify(webtoonsWithSignedUrls), {
    headers: {
      "Content-Type": "application/json",
      "X-Total-Count": total.toString(),
      "X-Total-Pages": Math.ceil(total / limit).toString(),
      "X-Current-Page": page.toString(),
    },
  });

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.author || !body.status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let coverImageUrl = null;

    // Handle base64 image upload to S3 if present
    if (body.coverImage) {
      try {
        // Remove the data:image/xyz;base64, prefix
        const base64Data = body.coverImage.split(";base64,").pop();
        if (!base64Data) {
          return new Response(
            JSON.stringify({ error: "Invalid image format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        const imageBuffer = Buffer.from(base64Data, "base64");

        // Generate a unique filename
        const filename = `webtoon-covers/${Date.now()}-${body.title
          .toLowerCase()
          .replace(/\s+/g, "-")}.jpg`;

        // Upload to S3
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: filename,
            Body: imageBuffer,
            ContentType: "image/jpeg",
            ACL: "public-read",
          })
        );

        // Generate the public URL
        coverImageUrl = `https://${process.env
          .ACCOUNT_ID!}.eu.r2.cloudflarestorage.com/${filename}`;
      } catch (error) {
        console.error("Error uploading to S3:", error);
        return new Response(
          JSON.stringify({ error: "Failed to upload image" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Create webtoon with the S3 URL
    try {
      const webtoon = await prisma.webtoon.create({
        data: {
          title: body.title,
          description: body.description,
          author: body.author,
          status: body.status,
          coverImage: coverImageUrl,
        },
      });

      return new Response(JSON.stringify(webtoon), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      });
    } catch (error) {
      console.error("Error creating webtoon:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create webtoon" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error parsing request:", error);
    return new Response(
      JSON.stringify({ error: "Invalid request format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
