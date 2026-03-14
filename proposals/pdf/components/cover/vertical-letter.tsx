import React from "react";
import { Text, View } from "@react-pdf/renderer"
import { mergeStyles } from "~/pdf/utility/merge-props"

function Root(props: React.ComponentPropsWithRef<typeof View>) {
    return (
        <View
            {...props}
            style={mergeStyles(
                {
                    position: "absolute",
                    bottom: "50%",
                    right: "-3cm",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: "rotate(270deg)",
                },
                props.style
            )}
        />
    )
}

function Line(props: React.ComponentPropsWithRef<typeof Text>) {
    return (
        <Text
            {...props}
            style={mergeStyles(
                {
                    textTransform: "uppercase",
                    fontSize: "7pt",
                    opacity: "0.7",
                    letterSpacing: "2pt",
                },
                props.style
            )}
        />
    )
}

function VerticalLetter(props: React.PropsWithChildren<{}>) {
    return (
        <Root>
            <Line>{props.children}</Line>
        </Root>
    )
}

export {
    Root,
    Line,
    VerticalLetter,
}