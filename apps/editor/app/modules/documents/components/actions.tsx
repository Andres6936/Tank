import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CloudAlert,
  CloudCheck,
  Plus,
  RotateCcw,
  Save,
  SaveOff,
} from "lucide-react";
import { overlay } from "overlay-kit";
import { useMemo } from "react";
import { useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/toast";
import { Toggle } from "~/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useTRPC } from "~/utils/trpc";
import { useViewContext } from "../context/view-context";
import {
  CreateDocumentModal,
  type Output as CreateDocumentOutputType,
} from "../modals/create-document";
import { ConfirmationReloadModal } from "../modals/confirmation-reload";

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
  const {
    id,
    isDirty,
    updatedAt,
    content,
    onDirtyChange,
    onContentChange,
    onUpdatedAtChange,
  } = useViewContext();

  const mutation = useMutation(
    trpc.documents.updateContent.mutationOptions({
      onSuccess: (payload) => {
        if (payload.statusCode === 200) {
          // Update the content with the response content formatted
          onDirtyChange(false);
          onContentChange(payload.body.Content);
          onUpdatedAtChange(payload.body.UpdatedAt);
        } else {
          toast.add({
            type: "error",
            title: "Failed to save document",
          });
        }
      },
    }),
  );

  const briefUpdatedAt = useMemo(
    () => formatDistanceToNow(updatedAt),
    [updatedAt],
  );

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            disabled={mutation.isPending}
            onClick={async () => {
              mutation.mutate({ Id: id, Content: content });
            }}
          >
            {isDirty ? (
              <CloudAlert className="stroke-red-600" />
            ) : (
              <CloudCheck className="stroke-lime-600" />
            )}
          </Button>
        }
      />
      <TooltipContent>
        {isDirty ? (
          <p>Not updated in {briefUpdatedAt}</p>
        ) : (
          <p>Last updated: {briefUpdatedAt}</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

const ActionToggleAutosave = () => {
  const { autosaveEnabled, onAutosaveChange } = useViewContext();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Toggle
            pressed={autosaveEnabled}
            onPressedChange={(pressed) => onAutosaveChange(pressed)}
            aria-label="Toggle autosave"
            variant="outline"
          >
            {autosaveEnabled ? (
              <Save strokeWidth={1} />
            ) : (
              <SaveOff strokeWidth={1} />
            )}
            Autosave
          </Toggle>
        }
      />
      <TooltipContent>
        {autosaveEnabled ? (
          <p>Autosave is enabled</p>
        ) : (
          <p>Autosave is disabled</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

const ActionReloadDocument = () => {
  const { isDirty } = useViewContext();

  const onPress = async () => {
    try {
      const result = await overlay.openAsync((args) => (
        <ConfirmationReloadModal {...args} />
      ));
    } catch (ignored) {}
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            onClick={onPress}
            disabled={!isDirty}
          >
            <RotateCcw strokeWidth={1} />
          </Button>
        }
      />
      <TooltipContent>
        <p>Reload document and discard changes</p>
      </TooltipContent>
    </Tooltip>
  );
};

export {
  ActionNewDocument,
  ActionSaveDocument,
  ActionToggleAutosave,
  ActionReloadDocument,
};
