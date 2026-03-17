import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { flatten } from "@react-pdf/stylesheet";

import { type StylesNode } from "~/pdf/utility/merge-props";
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

function Pad(
  props: React.ComponentPropsWithRef<typeof View> & { side: "left" | "right" },
) {
  const withSideStyle: StylesNode =
    props.side === "left"
      ? { justifyContent: "flex-start", alignItems: "flex-start" }
      : { justifyContent: "flex-end", alignItems: "flex-end" };

  return (
    <View
      {...props}
      style={flatten({
        gap: "2pt",
        flex: 1,
        ...withSideStyle,
        ...props.style,
      })}
    />
  );
}

function SignMe() {
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

export { Section, Row, SignMe, Pad };
