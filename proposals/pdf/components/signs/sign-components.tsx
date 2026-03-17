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

function Row(props: React.ComponentPropsWithRef<typeof View>) {
  return (
    <View
      {...props}
      style={flatten({ flexDirection: "row", ...props.style })}
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

function SignMe() {
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

export { Section, Row, SignMe, Pad };
