import React from "react";

import { Image, Page, Text, View } from "@react-pdf/renderer";
import Seal, { SvgBuffer } from "~/pdf/components/seal";

import * as UUIDLines from "~/pdf/components/cover/uuid-lines";
import * as MonthLines from "~/pdf/components/cover/month-lines";
import * as VerticalLetterComponent from "~/pdf/components/cover/vertical-letter";

type Props = {
  uuid: {
    short: string;
    long: string;
  };
  seal: string | undefined | null;
  code: string | undefined | null;
  text: string | undefined | null;
  barcode: string | undefined | null;
  type: string;
  title: string;
  month: string;
};

export default function Component(props: Props) {
  return (
    <Page size="A4" style={{ padding: "0.4cm", backgroundColor: "#14192f" }}>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "#f8f4e3",
          padding: "1cm",
          color: "#14192f",
          position: "relative",
        }}
      >
        <Text
          style={{
            textTransform: "uppercase",
            fontSize: "7pt",
            opacity: "0.7",
            letterSpacing: "2pt",
          }}
        >
          Ing. Joan A. Buriticá
        </Text>

        <Seal seal={props.seal} code={props.code} text={props.text} />

        <Text
          style={{
            textAlign: "center",
            fontSize: "38pt",
            fontStyle: "italic",
            fontFamily: "InstrumentSerif",
          }}
        >
          {props.type}
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: "52pt",
            marginTop: "2cm",
            fontFamily: "Merriweather",
            textTransform: "uppercase",
            letterSpacing: "2pt",
            transform: "scaleY(1.4)",
            lineHeight: "1.1",
          }}
          hyphenationCallback={(word) => [word]}
        >
          {props.title}
        </Text>

        <MonthLines.Root style={{ bottom: "4cm" }}>
          <MonthLines.Line>{props.month}</MonthLines.Line>
        </MonthLines.Root>

        <VerticalLetterComponent.Root>
          <VerticalLetterComponent.Line>
            {props.uuid.long}
          </VerticalLetterComponent.Line>
        </VerticalLetterComponent.Root>

        <View
          style={{
            position: "absolute",
            bottom: "1.8cm",
            right: "1.5cm",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "2pt",
          }}
        >
          <SvgBuffer svg={props.barcode} style={{ width: "160pt" }} />
          <UUIDLines.Line>{props.uuid.short}</UUIDLines.Line>
        </View>
      </View>
    </Page>
  );
}
