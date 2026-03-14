import React from "react";
import {Text} from "@react-pdf/renderer";
import {mergeStyles} from "~/pdf/utility/merge-props";

const Rule = (props: React.ComponentPropsWithRef<typeof Text>) => {
    return (
        <Text {...props} style={mergeStyles({fontWeight: "semibold", opacity: 0.6}, props.style)}/>
    )
}

export {
    Rule,
}