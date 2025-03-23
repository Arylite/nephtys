"use server";

import { processRecords } from "@/lib/algolia";

export async function processRecordsOnServer() {
  const res = await processRecords();
  return res;
}
