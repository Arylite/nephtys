import { z } from "zod";
const StatusEnum = z.enum(["ONGOING", "COMPLETED", "HIATUS", "DROPPED"]);

const WebtSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string(),
  description: z.string().nullable(),
  author: z.string(),
  coverImage: z.string().nullable(),
  status: StatusEnum,
});

type Webt = z.infer<typeof WebtSchema>;
