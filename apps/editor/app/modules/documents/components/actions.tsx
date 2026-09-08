import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  BrushCleaning,
  CloudAlert,
  CloudCheck,
  Download,
  MonitorOff,
  MonitorPlay,
  Plus,
  RotateCcw,
  Save,
  SaveOff,
  Stamp,
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
import { useAutosave } from "../hooks/useAutosave";
import { Spinner } from "~/components/ui/spinner";
import { asQueryPreview } from "../actions/preview";

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
    isSealed,
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

  const isDisabled = mutation.isPending || isSealed || !isDirty;

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
            disabled={isDisabled}
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
  const trpc = useTRPC();
  const {
    id,
    content,
    isDirty,
    isSealed,
    autosaveEnabled,
    onAutosaveChange,
    onDirtyChange,
    onUpdatedAtChange,
  } = useViewContext();

  const mutation = useMutation(
    trpc.documents.updateContent.mutationOptions({
      onSuccess: (payload) => {
        if (payload.statusCode === 200) {
          // Update the content with the response content formatted
          onDirtyChange(false);
          onUpdatedAtChange(payload.body.UpdatedAt);
        }
      },
    }),
  );

  const trigger = () => mutation.mutate({ Id: id, Content: content });

  useAutosave(trigger, { disabled: !autosaveEnabled || isSealed || !isDirty });

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Toggle
            pressed={autosaveEnabled}
            onPressedChange={(pressed) => onAutosaveChange(pressed)}
            aria-label="Toggle autosave"
            variant="outline"
            disabled={isSealed}
          >
            {autosaveEnabled ? (
              mutation.isPending ? (
                <Spinner strokeWidth={1} />
              ) : (
                <Save strokeWidth={1} />
              )
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

const ActionToggleAutopreview = () => {
  const { isSealed, autopreviewEnabled, onAutopreviewChange } =
    useViewContext();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Toggle
            pressed={autopreviewEnabled}
            onPressedChange={(pressed) => onAutopreviewChange(pressed)}
            aria-label="Toggle autopreview"
            variant="outline"
            disabled={isSealed}
          >
            {autopreviewEnabled ? (
              <MonitorPlay strokeWidth={1} />
            ) : (
              <MonitorOff strokeWidth={1} />
            )}
            Preview
          </Toggle>
        }
      />
      <TooltipContent>
        {autopreviewEnabled ? (
          <p>Preview is enabled</p>
        ) : (
          <p>Preview is disabled</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

const ActionDownload = () => {
  const { isSealed, content } = useViewContext();

  const onPress = async () => {
    if (isSealed) {
    } else {
      const result = await asQueryPreview({ xml: content });
      const link = document.createElement("a");
      link.href = result;
      link.download = "Preview - Draft.pdf";
      link.click();
      // Revoke the object URL after 10 seconds, avoid memory leaks
      setTimeout(() => URL.revokeObjectURL(result), 10_000);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button onClick={onPress} variant="outline" size="icon">
            <Download strokeWidth={1} />
          </Button>
        }
      />
      <TooltipContent>
        <p>Download the document</p>
      </TooltipContent>
    </Tooltip>
  );
};

const ActionReloadDocument = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { id, isDirty, onContentChange, onDirtyChange, onUpdatedAtChange } =
    useViewContext();

  const mutation = useMutation({
    mutationFn: async () => {
      const options = trpc.documents.getById.queryOptions(id);
      return await queryClient.fetchQuery(options);
    },
    onSuccess: (payload) => {
      if (payload.statusCode === 200) {
        onDirtyChange(false);
        onContentChange(payload.body.Content);
        onUpdatedAtChange(payload.body.UpdatedAt);
      } else {
        toast.add({
          type: "error",
          title: "Failed to reload document",
        });
      }
    },
  });

  const onPress = async () => {
    try {
      const result = await overlay.openAsync((args) => (
        <ConfirmationReloadModal {...args} />
      ));
      mutation.mutate();
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
            <BrushCleaning strokeWidth={1} />
          </Button>
        }
      />
      <TooltipContent>
        <p>Reload document and discard changes</p>
      </TooltipContent>
    </Tooltip>
  );
};

const ActionSealDocument = () => {
  const { isSealed } = useViewContext();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button className="min-w-20" disabled={isSealed}>
            <Stamp strokeWidth={1.5} />
            {isSealed ? "Already Sealed" : "Seal"}
          </Button>
        }
      />
      <TooltipContent>
        <p>Seal document</p>
      </TooltipContent>
    </Tooltip>
  );
};

export {
  ActionNewDocument,
  ActionSaveDocument,
  ActionToggleAutosave,
  ActionToggleAutopreview,
  ActionDownload,
  ActionReloadDocument,
  ActionSealDocument,
};
