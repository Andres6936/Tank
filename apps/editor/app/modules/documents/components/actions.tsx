import { CloudCheck, Plus } from "lucide-react";
import { overlay } from "overlay-kit";
import { useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import {
  CreateDocumentModal,
  type Output as CreateDocumentOutputType,
} from "../modals/create-document";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/utils/trpc";
import { toast } from "~/components/ui/toast";
import { useViewContext } from "../context/view-context";

const ActionNewDocument = () => {
  const trpc = useTRPC();
  const navigate = useNavigate();

  const mutation = useMutation(
    trpc.documents.create.mutationOptions({
      onMutate: (_, context) => {
        context.client.invalidateQueries({
          queryKey: trpc.documents.getAll.queryKey(),
        });
      },
      onSuccess: (payload) => {
        if (payload.statusCode === 200) {
          toast.add({
            type: "success",
            title: "Document created successfully",
          });
          const { Id } = payload.body;
          navigate(`/documents/view/${Id}`);
        } else {
          toast.add({
            type: "error",
            title: "Failed to create document",
          });
        }
      },
    }),
  );

  return (
    <Button
      variant="outline"
      className="min-h-16 gap-3 min-w-96 justify-start pl-4"
      onClick={async () => {
        try {
          const result = await overlay.openAsync<CreateDocumentOutputType>(
            (args) => <CreateDocumentModal {...args} />,
          );
          mutation.mutate(result);
        } catch (ignored) {}
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

const ActionSaveDocument = () => {
  const trpc = useTRPC();
  const { id, content, onContentChange } = useViewContext();

  const mutation = useMutation(
    trpc.documents.updateContent.mutationOptions({
      onSuccess: (payload) => {
        if (payload.statusCode === 200) {
          // Update the content with the response content formatted
          onContentChange(payload.body.Content);
        } else {
          toast.add({
            type: "error",
            title: "Failed to save document",
          });
        }
      },
    }),
  );

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={mutation.isPending}
      onClick={async () => {
        mutation.mutate({ Id: id, Content: content });
      }}
    >
      <CloudCheck />
    </Button>
  );
};

export { ActionNewDocument, ActionSaveDocument };
