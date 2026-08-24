import { useQuery } from "@tanstack/react-query";
import { XmlEditor } from "~/components/Editor";
import { useTRPC } from "~/utils/trpc";
import { Preview } from "../components/preview";

export default function View({ Id }: { Id: string }) {
  const trpc = useTRPC();
  const query = useQuery(trpc.documents.getById.queryOptions(Id));

  if (query.isLoading || !query.data) {
    return <p>Loading ...</p>;
  }

  if (query.isError) {
    return <p>Error: {query.error.message}</p>;
  }

  if (query.data.statusCode === 404) {
    return <p>Not Found</p>;
  }

  if (query.data.statusCode !== 200) {
    return <p>Error: {query.data.body.message}</p>;
  }

  const item = query.data.body;

  return (
    <div className="flex flex-1 flex-row gap-2">
      <div className="relative flex flex-1">
        <div className="absolute inset-0 flex-1">
          <XmlEditor content={item.Content} />
        </div>
      </div>
      <div className="relative flex flex-1">
        <div className="absolute inset-0 flex-1 border border-zinc-300">
          <Preview content={item.Content} />
        </div>
      </div>
    </div>
  );
}
