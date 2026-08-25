import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/utils/trpc";
import { Document } from "./document";

const InfinityList = () => {
  const trpc = useTRPC();
  const query = useQuery(trpc.documents.getAll.queryOptions());

  if (query.isLoading || !query.data) {
    return <p>Loading ...</p>;
  }

  if (query.isError) {
    return <p>Error: {query.error.message}</p>;
  }

  if (query.data.statusCode !== 200) {
    return <p>Error: {query.data.body.message}</p>;
  }

  const items = query.data.body;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,10rem)] gap-4 place-content-start">
      {items.map((item) => (
        <Document key={item.Id} document={item} />
      ))}
    </div>
  );
};

export { InfinityList };
