import { useState } from "react";
import { Link } from "react-router";
import {
  ChevronsUpDown,
  CloudDownload,
  Copy,
  LayoutGrid,
  List,
  Play,
  Plus,
  Settings,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/utils/trpc";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";

const Options = ({ Id }: { Id: string }) => {
  return (
    <div className="absolute top-8 left-2/4 -translate-x-2/4 bg-white rounded-md shadow">
      <ButtonGroup>
        <Button
          variant="outline"
          size="icon"
          render={(props) => <Link {...props} to={`/documents/view/${Id}`} />}
        >
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

type DocumentType = {
  Id: string;
  Title: string;
};

const Document = ({ document }: { document: DocumentType }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="relative w-[10rem] aspect-16/23 rounded border bg-zinc-200 hover:bg-zinc-300">
        <Options Id={document.Id} />
      </div>
      <p className="text-xs/4 text-balance text-center mt-2 px-2">
        {document.Title}
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
    <>
      <div>
        <Button
          variant="outline"
          className="min-h-16 gap-3 min-w-96 justify-start pl-4"
        >
          <Plus />
          <div className="text-start">
            <p className="text-xs font-semibold">Empty document</p>
            <p className="text-xs text-muted-foreground">Start from scratch</p>
          </div>
        </Button>
      </div>
      <div className="flex flex-row justify-between items-center">
        <Button>
          <Plus /> New folder
        </Button>
        <div className="flex flex-row gap-4">
          <ButtonGroup>
            <Button size="icon">
              <LayoutGrid size={18} strokeWidth={1} />
            </Button>
            <Button variant="outline" size="icon">
              <List size={18} strokeWidth={1} />
            </Button>
          </ButtonGroup>

          <div className="flex flex-row gap-2 items-center">
            <p className="text-muted-foreground text-xs">Sort by</p>
            <Button variant="outline">
              Last modified <ChevronsUpDown size={18} strokeWidth={1} />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,10rem)] gap-4 place-content-start">
        {items.map((item) => (
          <Document key={item.Id} document={item} />
        ))}
      </div>
    </>
  );
}
