import React from "react";
import { View } from "@react-pdf/renderer";
import { flatten } from "@react-pdf/stylesheet";

import { mergeStyles, type StylesNode } from "~/pdf/utility/merge-props";
import { Section as SectionView } from "~/pdf/components/section";
import { Title, Text } from "~/pdf/components/text";
import Seal from "~/pdf/components/seal";

function Section(props: React.PropsWithChildren<{}>) {
  return (
    <SectionView style={{ flex: 1 }} wrap={false}>
      <Title size="xs" style={{ marginVertical: "1cm" }}>
        Elaborado y Firmado
      </Title>

      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        {props.children}
      </View>
    </SectionView>
  );
}

function Row({
  style,
  ...props
}: React.ComponentPropsWithRef<typeof View> & StylesNode) {
  return (
    <View
      {...props}
      style={mergeStyles({ flexDirection: "row" }, { ...style, ...props })}
    />
  );
}

function Pad(
  props: React.ComponentPropsWithRef<typeof View> & { side: "left" | "right" },
) {
  const withSideStyle: StylesNode =
    props.side === "left"
      ? { justifyContent: "flex-end", alignItems: "flex-start" }
      : { justifyContent: "flex-end", alignItems: "flex-end" };

  return (
    <View
      {...props}
      style={flatten({
        gap: "1.5pt",
        flex: 1,
        ...withSideStyle,
        ...props.style,
      })}
    />
  );
}

function SignMeRight() {
  return (
    <Pad side="right">
      <Text style={{ fontFamily: "MonsieurLaDoulaise", fontSize: "27pt" }}>
        Andrés Salazar
      </Text>
      <Text>Ingeniero, Joan A. Buriticá S.</Text>
      <Text>Licencia Profesional: 171122-0620819 VLL</Text>
    </Pad>
  );
}

function SignMeLeft(props: React.ComponentPropsWithRef<typeof Seal>) {
  return (
    <Pad side="left">
      <Seal {...props} style={{ marginTop: 0, marginBottom: "0.5cm" }} />
      <Text>Teléfono: +57 319 (656) 94-58</Text>
      <Text>Contacto: andres6936@live.com</Text>
    </Pad>
  );
}

const SignLine = () => (
  <Text style={{ width: "100%", borderColor: "gray", borderTop: "0.5pt" }} />
);

type PadProps =
  | {
      empty?: false;
      signBy: string;
      withSign?: string | undefined | null;
      withSignStyle?: StylesNode | undefined | null;
    }
  | {
      empty: true;
    };

function PadLeft(props: PadProps) {
  if (props.empty) {
    return <Pad side="left" />;
  }

  return (
    <Pad side="left">
      {props.withSign && (
        <Text style={mergeStyles({ textAlign: "left" }, props.withSignStyle)}>
          {props.withSign}
        </Text>
      )}

      {!props.withSign && <SignLine />}
      <Text
        style={{
          fontSize: "10pt",
          paddingTop: "5pt",
        }}
      >
        {props.signBy}
      </Text>
    </Pad>
  );
}

function PadRight(props: PadProps) {
  if (props.empty) {
    return <Pad side="right" />;
  }

  return (
    <Pad side="right">
      {props.withSign && (
        <Text style={mergeStyles({ textAlign: "right" }, props.withSignStyle)}>
          {props.withSign}
        </Text>
      )}

      {!props.withSign && <SignLine />}
      <Text
        style={{
          fontSize: "10pt",
          paddingTop: "5pt",
          textAlign: "right",
        }}
      >
        {props.signBy}
      </Text>
    </Pad>
  );
}

export { Section, Row, SignMeRight, SignMeLeft, Pad, PadRight, PadLeft };
