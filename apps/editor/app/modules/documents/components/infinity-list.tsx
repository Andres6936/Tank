import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { useTRPC } from "~/utils/trpc";
import { Document } from "./document";
import { Button } from "~/components/ui/button";

const InfinityList = () => {
  const trpc = useTRPC();
  const queryInfinite = useInfiniteQuery({
    ...trpc.documents.getAllInfinite.infiniteQueryOptions(
      { limit: 10 },
      {
        getNextPageParam: (lastPage) =>
          lastPage.statusCode === 200 ? lastPage.body.nextCursor : undefined,
      },
    ),
  });

  if (queryInfinite.status === "pending") {
    return <p>Loading ...</p>;
  }

  if (queryInfinite.status === "error") {
    return <p>Error: {queryInfinite.error.message}</p>;
  }

  if (queryInfinite.data.pages.some((it) => it.statusCode !== 200)) {
    return <p>Error to load more items</p>;
  }

  const items = queryInfinite.data.pages.flatMap((it) => it.body.items);

  return (
    <div className="flex flex-col flex-1">
      <div className="grid grid-cols-[repeat(auto-fill,10rem)] gap-4 place-content-start ">
        {items.map((item) => (
          <Document key={item.Id} document={item} />
        ))}
      </div>
      <div className="mt-auto self-center">
        <Button onClick={() => queryInfinite.fetchNextPage()} variant="outline">
          <Plus size={18} strokeWidth={1.5} />{" "}
          {queryInfinite.isFetchingNextPage
            ? "Loading more ..."
            : queryInfinite.hasNextPage
              ? "See more"
              : "No more items"}
        </Button>
      </div>
    </div>
  );
};

export { InfinityList };
