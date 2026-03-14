import React from "react";
import { Text, View } from "@react-pdf/renderer";

const DEFAULT_VALUE = "Ing. Joan A. Buriticá"

type Props = {
    value?: string,
}

export default function IndicatorHeader({value}: Props = {value: DEFAULT_VALUE}) {
    return (
        <View
            fixed
            style={{
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "1pt solid #b50000",
                marginBottom: "0.5cm",
            }}
        >
            <Text
                style={{
                    color: "#b50000",
                    textTransform: "uppercase",
                    fontSize: "7pt",
                    letterSpacing: "1.5pt",
                    paddingBottom: "4pt",
                    transform: "scaleY(1.3)",
                }}
            >
                {value}
            </Text>
        </View>
    )
}