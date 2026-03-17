import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { flatten } from "@react-pdf/stylesheet";
import { mergeStyles, type StylesNode } from "~/pdf/utility/merge-props";
import { Section as SectionView } from "~/pdf/components/section";
import { Title } from "~/pdf/components/rule-content";

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

function Root(props: React.ComponentPropsWithRef<typeof View>) {
  return (
    <View
      wrap={false}
      {...props}
      style={mergeStyles({ flex: 1, justifyContent: "flex-end" }, props.style)}
    />
  );
}

function Row(props: React.ComponentPropsWithRef<typeof View>) {
  return (
    <View
      {...props}
      style={mergeStyles(
        { flexDirection: "row", gap: "25pt", height: "120pt" },
        props.style,
      )}
    />
  );
}

function Pad(props: React.ComponentPropsWithRef<typeof View>) {
  return (
    <View
      {...props}
      style={mergeStyles(
        { gap: "5pt", flex: 1, justifyContent: "flex-end" },
        props.style,
      )}
    />
  );
}

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
    return <Pad />;
  }

  return (
    <Pad>
      {props.withSign && (
        <Text style={mergeStyles({ textAlign: "left" }, props.withSignStyle)}>
          {props.withSign}
        </Text>
      )}

      <Text
        style={{
          fontSize: "10pt",
          paddingTop: "5pt",
          ...(props.withSign
            ? {}
            : { borderColor: "gray", borderTop: "0.5pt" }),
        }}
      >
        {props.signBy}
      </Text>
    </Pad>
  );
}

function PadRight(props: PadProps) {
  if (props.empty) {
    return <Pad />;
  }

  return (
    <Pad>
      {props.withSign && (
        <Text style={mergeStyles({ textAlign: "right" }, props.withSignStyle)}>
          {props.withSign}
        </Text>
      )}

      <Text
        style={{
          fontSize: "10pt",
          paddingTop: "5pt",
          textAlign: "right",
          ...(props.withSign
            ? {}
            : { borderColor: "gray", borderTop: "0.5pt" }),
        }}
      >
        {props.signBy}
      </Text>
    </Pad>
  );
}

function Own() {
  return (
    <View
      style={[
        {
          flex: 1,
          gap: "2pt",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        },
      ]}
    >
      <OwnSign />
    </View>
  );
}

function OwnSign() {
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

export { Section, Root, Row, Own, OwnSign, Pad, PadLeft, PadRight };
