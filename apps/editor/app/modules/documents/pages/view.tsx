import { useQuery } from "@tanstack/react-query";
import {
  Braces,
  Save,
  SaveOff,
  Settings,
  Signature,
  Stamp,
} from "lucide-react";

import { Toggle } from "~/components/ui/toggle";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import { useTRPC } from "~/utils/trpc";
import { Editor } from "../components/editor";
import { Preview } from "../components/preview";
import { ViewProvider } from "../context/view-context";

import * as Actions from "../components/actions";

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
    <ViewProvider id={Id} content={item.Content} updatedAt={item.UpdatedAt}>
      <div className="flex flex-1 flex-row gap-2">
        <div className="flex flex-col flex-1 space-y-2">
          <ButtonGroup>
            <Button variant="outline" size="icon">
              <Braces />
            </Button>
          </ButtonGroup>
          <div className="relative flex flex-1">
            <div className="absolute inset-0 flex-1">
              <Editor />
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 space-y-2">
          <div className="flex justify-between">
            <div className="flex flex-row gap-2">
              <ButtonGroup>
                <Actions.ActionSaveDocument />
              </ButtonGroup>

              <Toggle aria-label="Toggle autosave" variant="outline">
                <Save
                  strokeWidth={1}
                  className="group-aria-pressed/toggle:hidden"
                />
                <SaveOff
                  strokeWidth={1}
                  className="hidden group-aria-pressed/toggle:block"
                />
                Autosave
              </Toggle>
            </div>

            <div className="flex flex-row gap-2">
              <Button className="min-w-20">
                <Stamp strokeWidth={1.5} />
                Seal
              </Button>
              <ButtonGroup>
                <Button variant="outline" size="icon">
                  <Settings />
                </Button>
              </ButtonGroup>
            </div>
          </div>
          <div className="relative flex flex-1">
            <div className="absolute inset-0 flex-1 border border-zinc-300">
              <Preview />
            </div>
          </div>
        </div>
      </div>
    </ViewProvider>
  );
}
