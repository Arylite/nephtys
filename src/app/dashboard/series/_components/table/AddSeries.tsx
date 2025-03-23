"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Dropzone from "shadcn-dropzone";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import { z } from "zod";
import { toast } from "sonner";
const StatusEnum = z.enum(["ONGOING", "COMPLETED", "HIATUS", "DROPPED"]);

const WebtoonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  author: z.string().min(1, "Author is required"),
  coverImage: z.string().nullable(),
  status: StatusEnum,
});

export const AddSeries = () => {
  const DEBUG = false;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof WebtoonSchema>>({
    resolver: zodResolver(WebtoonSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      coverImage: "",
      status: "ONGOING",
    },
  });

  const convertToJpg = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to convert image to JPG"));
            }
          },
          "image/jpeg",
          0.9
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const convertToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  async function onSubmit(values: z.infer<typeof WebtoonSchema>) {
    if (DEBUG) {
      console.log(values);
    } else {
      try {
        setIsSubmitting(true);
        setIsLoading(true);

        let base64Image = null;
        if (coverImageFile) {
          const jpgBlob = await convertToJpg(coverImageFile);
          base64Image = await convertToBase64(jpgBlob);
        }

        const payload = {
          title: values.title,
          description: values.description || "",
          author: values.author,
          status: values.status,
          coverImage: base64Image,
        };

        const response = await fetch("/api/webtoon", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.status !== 201) {
          toast.error(`Failed to create webtoon | Status : ${response.status}`);
          throw new Error("Failed to create webtoon");
        }

        form.reset();
        setCoverImageFile(null);
        setPreviewUrl(null);
        toast.success("Webtoon added successfully");
      } catch (error) {
        console.error("Error creating webtoon:", error);
        toast.error("Failed to process image or create webtoon");
      } finally {
        setIsSubmitting(false);
        setIsLoading(false);
      }
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button disabled={isLoading} variant={"secondary"}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Add Webtoon"
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto min-h-screen">
        <div className="px-6 py-4">
          <SheetHeader className="mb-4">
            <SheetTitle>Add New Webtoon</SheetTitle>
            <SheetDescription>
              Fill in the details to add a new webtoon to your collection.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter webtoon title" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter author name" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter webtoon description"
                        {...field}
                        value={field.value || ""}
                        className="min-h-[100px] resize-none"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ONGOING">Ongoing</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="HIATUS">Hiatus</SelectItem>
                        <SelectItem value="DROPPED">Dropped</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem className="mb-8 min-h-[50px]">
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl className="h-full">
                      <Dropzone
                        onDrop={async (acceptedFiles) => {
                          const file = acceptedFiles[0];
                          setCoverImageFile(file);
                          field.onChange(file.name);
                          const preview = URL.createObjectURL(file);
                          setPreviewUrl(preview);
                        }}
                        accept={{
                          "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>

                    {previewUrl && (
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="relative group">
                            <Image
                              src={previewUrl}
                              alt="Preview"
                              width={100}
                              height={100}
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex flex-col text-sm">
                            <span className="font-medium truncate max-w-[150px]">
                              {coverImageFile?.name}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {coverImageFile
                                ? (coverImageFile.size / 1024 / 1024).toFixed(2)
                                : "0"}
                              MB
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => {
                            setPreviewUrl(null);
                            setCoverImageFile(null);
                            field.onChange("");
                          }}
                          disabled={isLoading}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Webtoon"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
