import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { useTRPC } from "~/utils/trpc";
import { Document } from "./document";
import { Button } from "~/components/ui/button";

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
    <div className="flex flex-col flex-1">
      <div className="grid grid-cols-[repeat(auto-fill,10rem)] gap-4 place-content-start ">
        {items.map((item) => (
          <Document key={item.Id} document={item} />
        ))}
      </div>
      <div className="mt-auto self-center">
        <Button variant="outline">
          <Plus size={18} strokeWidth={1.5} /> See more
        </Button>
      </div>
    </div>
  );
};

export { InfinityList };
