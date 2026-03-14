import React from "react";
import { Text } from "@react-pdf/renderer";
import { mergeStyles } from "~/pdf/utility/merge-props";

type TitleProps = {
    size?: "xs" | "md" | "lg" | "xl",
    textAlign?: "center" | "left" | "right",
}

const Title = (props: React.ComponentPropsWithRef<typeof Text> & TitleProps) => {
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
    }

    return (
        <Text
            {...props}
            hyphenationCallback={word => [word]}
            style={mergeStyles({
                fontFamily: "Merriweather",
                fontWeight: "bold",
                textAlign: props.textAlign || "center",
                transform: "scaleY(1.4), scaleX(0.9)",
                fontSize: getSize(props.size),
                marginBottom: "0.4cm",
                color: "#14192f"
            }, props.style)}
        />
    )
}

const TextJustify = (props: React.ComponentPropsWithRef<typeof Text>) => {
    return (
        <Text
            {...props}
            hyphenationCallback={word => [word]}
            style={mergeStyles({textAlign: "justify"}, props.style)}
        />
    )
}

const RuleContent = (props: React.ComponentPropsWithRef<typeof Text>) => {
    return (
        <Text
            {...props}
            hyphenationCallback={word => [word]}
            style={mergeStyles({marginLeft: "0.5cm", textAlign: "justify"}, props.style)}
        />
    )
}

export {
    Title,
    TextJustify,
    RuleContent,
}