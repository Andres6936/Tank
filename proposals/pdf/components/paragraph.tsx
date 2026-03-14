import React from "react";
import { Text } from "@react-pdf/renderer";
import { mergeStyles, type StylesNode } from "~/pdf/utility/merge-props";

type ParagraphProps = {
    bold?: boolean,
    italic?: boolean,
    size?: "xs" | "md" | "lg" | "xl",
    textAlign?: "center" | "left" | "right",
    opacity?: number,
}

const Paragraph = (props: React.ComponentPropsWithRef<typeof Text> & ParagraphProps) => {
    const getSize = (size: ParagraphProps["size"]) => {
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
    }

    const defaultStyles = {
        ...(props.textAlign ? {textAlign: props.textAlign} : {}),
        ...(props.size ? {fontSize: getSize(props.size)} : {}),
        ...(props.bold ? {fontWeight: "semibold", opacity: 0.9} : {}),
        ...(props.italic ? {fontStyle: "italic"} : {}),
        ...(props.opacity ? {opacity: props.opacity} : {}),
    } as StylesNode

    return (
        <Text {...props} style={mergeStyles(defaultStyles, props.style)}/>
    )
}

type Props = React.PropsWithChildren<React.ComponentPropsWithRef<typeof Text>>

const P =
    ({children, style, ...props}: Props & StylesNode) => {
        return (
            <Text
                {...props}
                children={children}
                style={mergeStyles(style, props)}
            />
        )
    }

const S = () => <Text>{' '}</Text>

export {
    Paragraph,
    S,
    P,
}