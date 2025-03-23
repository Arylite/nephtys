import { algoliasearch } from "algoliasearch";
import { analyticsClient } from "@algolia/client-analytics";
import prisma from "./prisma";

export const AlgoliaConfig = {
  appId: "PJIQ7YBU0O",
  apiKey: "733232cdb232f4e61053d92a092e470c",
  indexName: "webtoons_index",
};

export const algoliaClient = algoliasearch(
  AlgoliaConfig.appId,
  AlgoliaConfig.apiKey
);

export const analytics = analyticsClient(
  AlgoliaConfig.appId,
  AlgoliaConfig.apiKey,
  "de"
);

// Fetch and index objects in Algolia
export const processRecords = async () => {
  const datasetRequest = await prisma.webtoon.findMany();
  return await algoliaClient.saveObjects({
    indexName: AlgoliaConfig.indexName,
    objects: datasetRequest,
  });
};

export const search = async (query: string) => {
  const { results } = await algoliaClient.search({
    requests: [
      {
        indexName: AlgoliaConfig.indexName,
        query: query,
      },
    ],
  });
  return results;
};
