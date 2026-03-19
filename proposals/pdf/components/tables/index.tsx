import React from "react";
import { Text, View, type NodeProps } from "@react-pdf/renderer";
import { flatten } from "@react-pdf/stylesheet";

type StylesNode = Exclude<NodeProps["style"], undefined>;

const Table = (props: React.PropsWithChildren<{}>) => {
  return <View>{props.children}</View>;
};

const Header = (props: React.PropsWithChildren<{}>) => {
  return (
    <View
      style={flatten({
        backgroundColor: "#00000011",
        borderTopLeftRadius: "5pt",
        borderTopRightRadius: "5pt",
      })}
    >
      {props.children}
    </View>
  );
};

const Body = (props: React.PropsWithChildren<{}>) => {
  return <View>{props.children}</View>;
};

const Footer = (props: React.PropsWithChildren<{}>) => {
  return (
    <View
      style={flatten({
        backgroundColor: "#00000011",
      })}
    >
      {props.children}
    </View>
  );
};

const Row = (props: React.PropsWithChildren<{}>) => {
  return (
    <View
      style={flatten({
        flexDirection: "row",
        borderBottomWidth: "0.3pt",
        borderBottomColor: "#14192f",
        paddingHorizontal: "5pt",
        paddingVertical: "5pt",
      })}
    >
      {props.children}
    </View>
  );
};

const Cell = (props: React.PropsWithChildren<StylesNode>) => {
  return <Text style={flatten({ flex: 1, ...props })}>{props.children}</Text>;
};

export { Table, Header, Body, Footer, Row, Cell };
