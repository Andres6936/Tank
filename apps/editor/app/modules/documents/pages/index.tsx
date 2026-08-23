import { useState } from "react";
import { CloudDownload, Copy, Play, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/utils/trpc";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";

const Options = () => {
  return (
    <div className="absolute top-8 left-2/4 -translate-x-2/4 bg-white rounded-md shadow">
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <Play size={18} strokeWidth={1} />
        </Button>
        <Button variant="outline" size="icon">
          <CloudDownload size={18} strokeWidth={1} />
        </Button>
        <Button variant="outline" size="icon">
          <Copy size={18} strokeWidth={1} />
        </Button>
        <Button variant="outline" size="icon">
          <Settings size={18} strokeWidth={1} />
        </Button>
      </ButtonGroup>
    </div>
  );
};

const Document = () => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="relative w-[10rem] aspect-16/23 rounded border bg-zinc-200 hover:bg-zinc-300">
        <Options />
      </div>
      <p className="text-xs/4 text-balance text-center mt-2 px-2">
        Asistente Conversacional y Operativo (IA)
      </p>
    </div>
  );
};

export default function Page() {
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
        <Document key={item.Id} />
      ))}
    </div>
  );
}
