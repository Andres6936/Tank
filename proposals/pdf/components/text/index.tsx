import React from "react";
import { Text as PDFText, View } from "@react-pdf/renderer";
import { mergeStyles, type StylesNode } from "~/pdf/utility/merge-props";

const BulletText = (props: React.ComponentPropsWithRef<typeof PDFText>) => {
  return (
    <View style={{ flexDirection: "row", gap: "12pt" }} wrap={false}>
      <View
        style={{
          width: "4pt",
          aspectRatio: "1/1",
          backgroundColor: "black",
          borderRadius: "100",
          padding: "2pt",
          marginTop: "5pt",
        }}
      />
      <PDFText
        {...props}
        hyphenationCallback={(word) => [word]}
        style={mergeStyles({ flex: 1, textAlign: "justify" }, props.style)}
      />
    </View>
  );
};

type TextProps = {
  bold?: boolean;
  italic?: boolean;
  size?: "xs" | "md" | "lg" | "xl";
  textAlign?: "center" | "left" | "right";
  opacity?: number;
};

const Text = (
  props: React.ComponentPropsWithRef<typeof PDFText> & TextProps,
) => {
  const getSize = (size: TextProps["size"]) => {
    switch (size) {
      case "xs":
        return "7pt";
      case "md":
        return "8pt";
      case "lg":
        return "10t";
      case "xl":
        return "12pt";
    }
  };

  const defaultStyles = {
    ...(props.textAlign ? { textAlign: props.textAlign } : {}),
    ...(props.size ? { fontSize: getSize(props.size) } : {}),
    ...(props.bold ? { fontWeight: "semibold", opacity: 0.9 } : {}),
    ...(props.italic ? { fontStyle: "italic" } : {}),
    ...(props.opacity ? { opacity: props.opacity } : {}),
  } as StylesNode;

  return <PDFText {...props} style={mergeStyles(defaultStyles, props.style)} />;
};

type Props = React.PropsWithChildren<
  React.ComponentPropsWithRef<typeof PDFText>
>;

const P = ({ children, style, ...props }: Props & StylesNode) => {
  return (
    <PDFText {...props} children={children} style={mergeStyles(style, props)} />
  );
};

const S = () => <PDFText> </PDFText>;

type TitleProps = {
  size?: "xs" | "md" | "lg" | "xl";
  textAlign?: "center" | "left" | "right";
};

const Title = (
  props: React.ComponentPropsWithRef<typeof PDFText> & TitleProps,
) => {
  const getSize = (size: TitleProps["size"] = "xl") => {
    switch (size) {
      case "xs":
        return "10pt";
      case "md":
        return "12pt";
      case "lg":
        return "14pt";
      case "xl":
        return "16pt";
    }
  };

  return (
    <PDFText
      {...props}
      hyphenationCallback={(word) => [word]}
      style={mergeStyles(
        {
          fontFamily: "Merriweather",
          fontWeight: "bold",
          textAlign: props.textAlign || "center",
          transform: "scaleY(1.4), scaleX(0.9)",
          fontSize: getSize(props.size),
          marginBottom: "0.4cm",
          color: "#14192f",
        },
        props.style,
      )}
    />
  );
};

const TextJustify = (props: React.ComponentPropsWithRef<typeof PDFText>) => {
  return (
    <PDFText
      {...props}
      hyphenationCallback={(word) => [word]}
      style={mergeStyles({ textAlign: "justify" }, props.style)}
    />
  );
};

const RuleContent = (props: React.ComponentPropsWithRef<typeof PDFText>) => {
  return (
    <PDFText
      {...props}
      hyphenationCallback={(word) => [word]}
      style={mergeStyles(
        { marginLeft: "0.5cm", textAlign: "justify" },
        props.style,
      )}
    />
  );
};

export { BulletText, Text, S, P, Title, TextJustify, RuleContent };
