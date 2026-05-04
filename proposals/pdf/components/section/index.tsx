import React from "react";
import { type NodeProps, Page, View } from "@react-pdf/renderer";
import { mergeStyles } from "~/pdf/utility/merge-props";
import { flatten } from "@react-pdf/stylesheet";

type StylesNode = NodeProps["style"];

const Paginate = (props: React.ComponentPropsWithRef<typeof Page>) => {
  return (
    <Page
      {...props}
      size="A4"
      style={mergeStyles(
        {
          position: "relative",
          fontSize: "11pt",
          fontFamily: "Geist",
          fontWeight: "light",
          backgroundColor: "#f8f4e3",
          paddingVertical: "2cm",
          paddingHorizontal: "2.5cm",
          color: "#14192f",
        },
        props.style,
      )}
    />
  );
};

const Section = ({
  children,
  wrap,
  style,
  ...props
}: React.ComponentPropsWithRef<typeof View> & StylesNode) => {
  return (
    <View
      {...props}
      children={children}
      wrap={wrap ?? false}
      style={mergeStyles(
        { marginTop: "1cm", gap: "0.5cm" },
        { ...style, ...props },
      )}
    />
  );
};

type IndentProps = React.ComponentPropsWithRef<typeof View> & {
  level?: number | undefined;
};

const Indent = ({ style, ...props }: IndentProps & StylesNode) => (
  <View
    {...props}
    style={mergeStyles(
      { marginLeft: `${props.level || 1}cm` },
      { ...style, ...props },
    )}
  />
);

export { Paginate, Section, Indent };
