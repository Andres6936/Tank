import React from "react";
import {Text} from "@react-pdf/renderer";
import {mergeStyles} from "~/pdf/utility/merge-props";

function Line(props: React.ComponentPropsWithRef<typeof Text>) {
    return (
        <Text
            {...props}
            style={mergeStyles(
                {
                    textTransform: "uppercase",
                    fontSize: "7pt",
                    opacity: "0.7",
                    letterSpacing: "1pt",
                },
                props.style,
            )}
        />
    )
}

function SansLine(props: React.ComponentPropsWithRef<typeof Text>) {
    return (
        <Text
            {...props}
            style={mergeStyles(
                {
                    fontFamily: "Roboto",
                    opacity: "0.7",
                    letterSpacing: "1pt",
                },
                props.style,
            )}
        />
    )
}

export {
    Line,
    SansLine,
}