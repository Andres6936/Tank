import React from "react";
import {
  type NodeProps,
  Page as PDFPage,
  View,
  Text,
} from "@react-pdf/renderer";

import { mergeStyles } from "~/pdf/utility/merge-props";
import * as SealComponent from "~/pdf/components/seal";

const Page = ({ children }: React.PropsWithChildren<{}>) => (
  <Pagination>
    <Container>{children}</Container>
  </Pagination>
);

const Pagination = (props: React.ComponentPropsWithRef<typeof Page>) => {
  return (
    <PDFPage
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
  seal: string | undefined | null;
  code: string | undefined | null;
  text: string | undefined | null;
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
      <SealComponent.BufferImage buffer={props.seal} />
      <SealComponent.AbsoluteCenter>
        <SealComponent.Square size={48}>
          <SealComponent.SvgBuffer svg={props.code} />
        </SealComponent.Square>
      </SealComponent.AbsoluteCenter>

      <SealComponent.AbsoluteCenter>
        <SealComponent.BufferImage buffer={props.text} />
      </SealComponent.AbsoluteCenter>
    </SealComponent.Square>
  );
};

const BreBCode = ({ code }: { code: string | undefined | null }) => {
  return (
    <SealComponent.Square size={148}>
      <SealComponent.SvgBuffer svg={code} />
    </SealComponent.Square>
  );
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

function Sign() {
  return (
    <View
      style={[
        {
          gap: "2pt",
          paddingTop: "1cm",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        },
      ]}
    >
      <Text style={{ fontFamily: "MonsieurLaDoulaise", fontSize: "27pt" }}>
        Andrés Salazar
      </Text>
      <Text>Ingeniero, Joan A. Buriticá S.</Text>
      <Text>Licencia Profesional: 171122-0620819 VLL</Text>
    </View>
  );
}

export { Page, Seal, Section, Sign, BreBCode };
