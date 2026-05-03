import React from "react";
import { Image, View } from "@react-pdf/renderer";
import { isEmptyNullOrUndefined } from "~/lib/utils";
import { mergeStyles } from "~/pdf/utility/merge-props";
import { flatten } from "@react-pdf/stylesheet";
import { fromSvg } from "~/pdf/svg/parser";

type Props = React.ComponentPropsWithRef<typeof View> & {
  seal: string | undefined | null;
  code: string | undefined | null;
  text: string | undefined | null;
};

export default function Component(props: Props) {
  return (
    <Square
      size={148}
      style={flatten({
        marginTop: "1.5cm",
        marginBottom: "2cm",
        ...props.style,
      })}
    >
      <BufferImage buffer={props.seal} />
      <AbsoluteCenter>
        <Square size={48}>
          <SvgBuffer svg={props.code} />
        </Square>
      </AbsoluteCenter>

      <AbsoluteCenter>
        <BufferImage buffer={props.text} />
      </AbsoluteCenter>
    </Square>
  );
}

type BufferImageProps = {
  buffer: string | undefined | null;
};

function BufferImage(props: BufferImageProps) {
  if (isEmptyNullOrUndefined(props.buffer)) return null;

  return (
    <Image
      source={Buffer.from(props.buffer, "base64")}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function SvgBuffer(props: { svg: string | undefined | null }) {
  if (!props.svg) return null;
  return fromSvg(props.svg, {
    style: { width: "100%", height: "100%" },
  });
}

type SquareProps = {
  size: number;
};

function Square(props: React.ComponentPropsWithRef<typeof View> & SquareProps) {
  return (
    <View
      {...props}
      style={mergeStyles(
        {
          height: props.size,
          width: props.size,
          minWidth: props.size,
          minHeight: props.size,
        },
        props.style,
      )}
      wrap
    />
  );
}

function AbsoluteCenter(props: React.ComponentPropsWithRef<typeof View>) {
  return (
    <View
      {...props}
      style={mergeStyles(
        {
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        props.style,
      )}
    />
  );
}

export { Square, BufferImage, AbsoluteCenter };
