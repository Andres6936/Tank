import "konva/canvas-backend";
import "~/pdf/utility/register-fonts";

import React, { Fragment } from "react";
import { Document } from "@react-pdf/renderer";
import { type ComponentMap, fromFile } from "~/lib/node.factory";

import { Table, Row, Cell, Header, Footer } from "~/pdf/components/table";
import { Indent, Paginate, Section } from "~/pdf/components/section";
import { BulletText, Text, S, Paragraph, Title } from "~/pdf/components/text";

// Complex Component
import Cover from "~/pdf/components/cover";
import IndicatorHeader from "~/pdf/components/cover/indicator-header";

// Sign Component
import {
  Section as SignSection,
  SignMeLeft,
  SignMeRight,
  Pad as SignPad,
  Row as SignRow,
  PadLeft as SignPadLeft,
  PadRight as SignPadRight,
} from "~/pdf/components/signs/sign-components";

// Utility Seals Buffers
import { getBufferSeals } from "~/pdf/utility/buffer-seals";

const components: ComponentMap = {
  // Complex Component
  IndicatorHeader,

  // Sign Component
  SignSection,
  SignRow,
  SignMeRight,
  SignPad,
  SignPadLeft,
  SignPadRight,

  // Table Component
  Table,
  Row,
  Cell,
  Header,
  Footer,

  // Section Component
  Paginate,
  Section,
  Indent,

  // Text Component
  Paragraph,
  Title,
  BulletText,
  Text,
  S,
};

const getTreeNode = async (
  xmlPath: string,
  buffers: Awaited<ReturnType<typeof getBufferSeals>>,
) => {
  const properties: Record<string, unknown> = {};
  const nodes = await fromFile(xmlPath, components, {
    interceptTags: ["Document", "Cover", "SignMeLeft"],
    onInterceptTag: (tagName, props) => {
      if (tagName === "Document") {
        for (const [key, value] of Object.entries(props)) {
          properties[key] = value;
        }
        return null;
      }
      if (tagName === "Cover") {
        return React.createElement(
          Cover,
          {
            uuid: buffers.uuid,
            seal: buffers.seal,
            code: buffers.code,
            text: buffers.text,
            barcode: buffers.barcode,
            type: props.type as string,
            title: props.title as string,
            month: props.month as string,
          },
          [],
        );
      }
      if (tagName === "SignMeLeft") {
        return React.createElement(
          SignMeLeft,
          {
            seal: buffers.seal,
            code: buffers.code,
            text: buffers.text,
          },
          [],
        );
      }
      return null;
    },
    onUnknownTag: (tagName) => {
      if (tagName === "Fragment") return Fragment;
      return null; // null = unwrap, deja sólo los children
    },
  });
  return { nodes, properties };
};

const withBook = async (
  nodes: React.ReactNode,
  properties: Record<string, unknown>,
) => <Document {...properties}>{nodes}</Document>;

const run = async (args: {
  file: string;
  buffers: Awaited<ReturnType<typeof getBufferSeals>>;
}) => {
  const { nodes, properties } = await getTreeNode(args.file, args.buffers);
  return await withBook(nodes, properties);
};

export { run };
