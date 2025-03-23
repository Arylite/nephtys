"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { processRecordsOnServer } from "@/interfaces/algolia";
import { useState } from "react";
import { toast } from "sonner";

export default function AlgoliaSettings() {
  const [loading, setLoading] = useState(false);

  async function handleSynchronize() {
    setLoading(true);
    try {
      const res = await processRecordsOnServer();
      if (res) {
        console.log(res);
        toast.success("Records synchronized successfully");
      }
    } catch (error) {
      console.error("Failed to synchronize records:", error);
      toast.error("Failed to synchronize records");
    }
    setLoading(false);
  }

  return (
    <main className="flex flex-col gap-2">
      <div className="border-b w-full">
        <h1 className="text-2xl font-bold mb-4">Algolia Settings</h1>
      </div>
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Synchronize Index</CardTitle>
            <CardDescription>
              Manually trigger an index synchronization
            </CardDescription>
          </CardHeader>
          <CardContent>
            Click the button below to synchronize your Algolia index with your
            current data.
          </CardContent>
          <CardFooter>
            <Button
              variant={"secondary"}
              className="w-full cursor-pointer"
              onClick={handleSynchronize}
              disabled={loading}
            >
              {loading ? "Synchronizing..." : "Synchronize Index"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
