import React from "react";
import {Text, View} from "@react-pdf/renderer";
import {mergeStyles} from "~/pdf/utility/merge-props";

const BulletText = (props: React.ComponentPropsWithRef<typeof Text>) => {
    return (
        <View style={{flexDirection: "row", gap: "12pt"}} wrap={false}>
            <View style={{
                width: "4pt",
                aspectRatio: "1/1",
                backgroundColor: "black",
                borderRadius: "100",
                padding: "2pt",
                marginTop: "5pt"
            }}/>
            <Text
                {...props}
                hyphenationCallback={word => [word]}
                style={mergeStyles({flex: 1, textAlign: "justify"}, props.style)}
            />
        </View>
    )
}


export {
    BulletText,
}