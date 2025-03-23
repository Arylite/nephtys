import { AlgoliaConfig } from "@/lib/algolia";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, SearchBox } from "react-instantsearch";

const searchClient = algoliasearch(AlgoliaConfig.appId, AlgoliaConfig.apiKey);

export function AlgoliaSearch() {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={AlgoliaConfig.indexName}
    >
      <SearchBox />
    </InstantSearch>
  );
}
