import React from "react";
import { type NodeProps, Page, View } from "@react-pdf/renderer";

import { mergeStyles } from "~/pdf/utility/merge-props";
import * as SealComponent from "~/pdf/components/cover/seal";

const Pagination = (props: React.ComponentPropsWithRef<typeof Page>) => {
  return (
    <Page
      {...props}
      size="A4"
      style={{
        fontSize: "12pt",
        fontFamily: "Geist",
        fontWeight: "normal",
        backgroundColor: "#f8f4e3",
      }}
    />
  );
};

const Container = (props: React.ComponentPropsWithRef<typeof View>) => {
  return (
    <View
      {...props}
      style={{
        position: "relative",
        paddingVertical: "2.5cm",
        paddingHorizontal: "2.5cm",
        flex: 1,
      }}
    />
  );
};

type SealProps = {
  buffer: {
    seal: string | undefined | null;
    code: string | undefined | null;
    text: string | undefined | null;
  };
};

const Seal = (props: SealProps) => {
  return (
    <SealComponent.Square
      size={148}
      style={{
        position: "absolute",
        top: 25,
        left: 25,
      }}
    >
      <SealComponent.BufferImage buffer={props.buffer.seal} />
      <SealComponent.AbsoluteCenter>
        <SealComponent.Square size={48}>
          <SealComponent.BufferImage buffer={props.buffer.code} />
        </SealComponent.Square>
      </SealComponent.AbsoluteCenter>

      <SealComponent.AbsoluteCenter>
        <SealComponent.BufferImage buffer={props.buffer.text} />
      </SealComponent.AbsoluteCenter>
    </SealComponent.Square>
  );
};

const Header = (props: React.ComponentPropsWithRef<typeof View>) => {
  return <View {...props} style={{ alignItems: "flex-end" }} />;
};

const Body = (props: React.ComponentPropsWithRef<typeof View>) => {
  return (
    <View
      {...props}
      style={{
        flexGrow: 1,
        justifyContent: "center",
        alignContent: "center",
      }}
    />
  );
};

const Footer = (props: React.ComponentPropsWithRef<typeof View>) => {
  return <View {...props} />;
};

type StylesNode = NodeProps["style"];

const Section = ({
  children,
  style,
  ...props
}: React.ComponentPropsWithRef<typeof View> & StylesNode) => {
  return (
    <View {...props} children={children} style={mergeStyles(style, props)} />
  );
};

export { Pagination, Container, Seal, Header, Body, Footer, Section };
