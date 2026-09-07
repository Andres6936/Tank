import React from "react";
import type { EditorView } from "@uiw/react-codemirror";
import { TypeStateDocumentKeys } from "../utility/enums";

type ViewContextProps = {
  id: string;
  isDirty: boolean;
  isSealed: boolean;
  content: string;
  updatedAt: string;
  autosaveEnabled: boolean;
  autopreviewEnabled: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  onContentChange: (content: string) => void;
  onUpdatedAtChange: (updatedAt: string) => void;
  onAutosaveChange: (autosaveEnabled: boolean) => void;
  onAutopreviewChange: (autopreviewEnabled: boolean) => void;

  // References to the editor view and its methods
  getEditor: () => EditorView | null;
  injectEditor: (ref: EditorView) => void;
};

const ViewContext = React.createContext<ViewContextProps | null>(null);

const ViewProvider = (
  props: React.PropsWithChildren<{
    document: {
      Id: string;
      Content: string;
      TypeState: string;
      UpdatedAt: string;
    };
  }>,
) => {
  const [isDirty, setIsDirty] = React.useState(false);
  const [content, setContent] = React.useState(props.document.Content);
  const [updatedAt, setUpdatedAt] = React.useState(props.document.UpdatedAt);
  const [autosaveEnabled, setAutosaveEnabled] = React.useState(false);
  const [autopreviewEnabled, setAutopreviewEnabled] = React.useState(true);

  const editor = React.useRef<EditorView>(null);

  const getEditor = () => {
    return editor.current;
  };

  const injectEditor = (ref: EditorView) => {
    editor.current = ref;
  };

  const onContentChange = (newContent: string) => {
    setContent(newContent);
  };
  const onUpdatedAtChange = (newUpdatedAt: string) => {
    setUpdatedAt(newUpdatedAt);
  };
  const onDirtyChange = (newIsDirty: boolean) => {
    setIsDirty(newIsDirty);
  };
  const onAutosaveChange = (autosaveEnable: boolean) => {
    setAutosaveEnabled(autosaveEnable);
  };
  const onAutopreviewChange = (autopreviewEnable: boolean) => {
    setAutopreviewEnabled(autopreviewEnable);
  };

  return (
    <ViewContext.Provider
      value={{
        id: props.document.Id,
        isSealed: props.document.TypeState === TypeStateDocumentKeys.Sealed,
        isDirty,
        content,
        updatedAt,
        autosaveEnabled,
        autopreviewEnabled,
        onDirtyChange,
        onContentChange,
        onUpdatedAtChange,
        onAutosaveChange,
        onAutopreviewChange,
        // References to the editor view and its methods
        getEditor,
        injectEditor,
      }}
    >
      {props.children}
    </ViewContext.Provider>
  );
};

const useViewContext = () => {
  const context = React.useContext(ViewContext);
  if (!context) {
    throw new Error("useViewContext must be used within a ViewContext");
  }
  return context;
};

export { useViewContext, ViewProvider };
