import React, { Fragment } from "react";
import { Text } from "@react-pdf/renderer";
import { flatten } from "@react-pdf/stylesheet";

function Root(props: React.ComponentPropsWithRef<typeof Text>) {
    return (
        <Text
            {...props}
            style={flatten({
                marginTop: "0.5cm",
                position: "absolute",
                bottom: "2cm",
                color: "#b50000",
                fontSize: "18pt",
                fontFamily: "Merriweather",
                textTransform: "uppercase",
                transform: "scaleY(1.4)",
                ...props.style
            })}
        />
    )
}

function Line({children}: { children: string }) {
    const [firsLetter, ...rest] = children;

    return (
        <Fragment>
            <Text style={{fontSize: "22pt"}}>{firsLetter.toUpperCase()}</Text>{rest}
        </Fragment>
    )
}

export {
    Root,
    Line,
}