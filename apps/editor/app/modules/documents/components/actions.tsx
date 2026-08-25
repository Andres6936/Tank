import { Plus } from "lucide-react";
import { overlay } from "overlay-kit";
import { useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { CreateDocumentModal } from "../modals/create-document";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/utils/trpc";
import { toast } from "~/components/ui/toast";

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
          const result = await overlay.openAsync<{
            Title: string;
            Subject: string;
          }>((args) => <CreateDocumentModal {...args} />);
          mutation.mutate({
            Title: result.Title,
            Subject: result.Subject,
            Content: "",
          });
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

export { ActionNewDocument };
