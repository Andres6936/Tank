import React from "react";

type ViewContextProps = {
  content: string;
  onContentChange: (content: string) => void;
};

const ViewContext = React.createContext<ViewContextProps | null>(null);

const ViewProvider = (props: React.PropsWithChildren<{ content: string }>) => {
  const [content, setContent] = React.useState(props.content);
  const onContentChange = (newContent: string) => {
    setContent(newContent);
  };
  return (
    <ViewContext.Provider value={{ content, onContentChange }}>
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
