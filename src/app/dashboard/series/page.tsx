"use client";
import { Webtoon } from "@prisma/client";
import useSWR from "swr";
import { DataTable } from "./_components/table/data-table";
import { columns } from "./_components/table/columns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { AddSeries } from "./_components/table/AddSeries";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const ITEMS_PER_PAGE = 10;

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

function WebtoonsTable({
  currentPage,
  data,
}: {
  currentPage: number;
  data: Webtoon[];
}) {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={paginatedData} />
    </div>
  );
}

export default function SeriesDashboard() {
  const { data, error, isLoading } = useSWR<Webtoon[]>("/api/webtoon", fetcher);
  const [currentPage, setCurrentPage] = useState(1);

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  const hasData = data && data.length > 0;
  const totalPages = Math.ceil((data?.length || 0) / ITEMS_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <main className="flex flex-col gap-2">
      <div className="border-b w-full flex">
        <h1 className="text-2xl font-bold mb-4">Series</h1>
        <div className="flex-1" />
        <AddSeries />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Series Management</CardTitle>
          <CardDescription>
            Manually trigger an index synchronization
          </CardDescription>
        </CardHeader>
        <CardContent className="py-0 h-full">
          <div className="flex flex-col items-center h-full">
            <WebtoonsTable currentPage={currentPage} data={data || []} />
            {hasData && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {pageNumbers.map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        className={
                          currentPage === pageNum
                            ? "bg-primary text-primary-foreground"
                            : "cursor-pointer"
                        }
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
