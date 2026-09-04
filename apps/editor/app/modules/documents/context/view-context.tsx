import React from "react";

type ViewContextProps = {
  id: string;
  isDirty: boolean;
  content: string;
  updatedAt: string;
  autosaveEnabled: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  onContentChange: (content: string) => void;
  onUpdatedAtChange: (updatedAt: string) => void;
  onAutosaveChange: (autosaveEnabled: boolean) => void;
};

const ViewContext = React.createContext<ViewContextProps | null>(null);

const ViewProvider = (
  props: React.PropsWithChildren<{
    id: string;
    content: string;
    updatedAt: string;
  }>,
) => {
  const [isDirty, setIsDirty] = React.useState(false);
  const [content, setContent] = React.useState(props.content);
  const [updatedAt, setUpdatedAt] = React.useState(props.updatedAt);
  const [autosaveEnabled, setAutosaveEnabled] = React.useState(true);

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

  return (
    <ViewContext.Provider
      value={{
        id: props.id,
        isDirty,
        content,
        updatedAt,
        autosaveEnabled,
        onDirtyChange,
        onContentChange,
        onUpdatedAtChange,
        onAutosaveChange,
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

export { ViewProvider, useViewContext };
