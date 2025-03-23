"use client";

import { Webtoon } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Webtoon>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <div className="text-left mx-2">{id}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <div className="text-left mx-2">{title}</div>;
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.getValue("author") as string;
      return <div className="text-left mx-2">{author}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex items-center justify-start">
          <Badge variant={"outline"}>{status}</Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end">
          <Link
            href={`/dashboard/series/${row.getValue("id")}`}
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <Pencil className="h-4 w-4" />
          </Link>
        </div>
      );
    },
  },
];
