import { Plus } from "lucide-react";
import { overlay } from "overlay-kit";

import { Button } from "~/components/ui/button";
import { CreateDocumentModal } from "../modals/create-document";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/utils/trpc";

const ActionNewDocument = () => {
  const trpc = useTRPC();
  const mutation = useMutation(
    trpc.documents.create.mutationOptions({
      onSuccess: (payload) => {},
    }),
  );

  return (
    <Button
      variant="outline"
      className="min-h-16 gap-3 min-w-96 justify-start pl-4"
      onClick={async () => {
        const result = await overlay.openAsync<{
          Title: string;
          Subject: string;
        }>((args) => <CreateDocumentModal {...args} />);
        mutation.mutate({
          Title: result.Title,
          Subject: result.Subject,
          Content: "",
        });
      }}
    >
      <Plus />
      <div className="text-start">
        <p className="text-xs font-semibold">Empty document</p>
        <p className="text-xs text-muted-foreground">Start from scratch</p>
      </div>
    </Button>
  );
};

export { ActionNewDocument };
