import "konva/canvas-backend";
import "~/pdf/utility/register-fonts";

import React, { Fragment } from "react";
import { Document } from "@react-pdf/renderer";
import { type ComponentMap, fromString } from "~/lib/node.factory";

import { Indent, Paginate } from "~/pdf/components/section";
import { Line, SansLine } from "~/pdf/components/cover/uuid-lines";
import { VerticalLetter } from "~/pdf/components/cover/vertical-letter";
import { BulletText, Text, S, Paragraph, Title } from "~/pdf/components/text";
import {
  Body,
  Container,
  Footer,
  Header,
  Pagination,
  Seal,
  Section,
  Sign,
} from "~/pdf/components/invoices";

// Complex Component
import Cover from "~/pdf/components/cover";
import IndicatorHeader from "~/pdf/components/cover/indicator-header";

// Sign Component
import {
  Section as SignSection,
  SignMeLeft,
  SignMeRight,
  Row as SignRow,
} from "~/pdf/components/signs/sign-components";

// Utility Seals Buffers
import { getBufferSeals } from "~/pdf/utility/buffer-seals";

const components: ComponentMap = {
  // Complex Component
  IndicatorHeader,

  // Sign Component
  Line,
  SansLine,
  SignSection,
  SignRow,
  SignMeRight,
  VerticalLetter,
  Seal,
  Sign,

  // Section Component
  Paginate,
  Section,
  Indent,
  Header,
  Footer,
  Body,
  Container,
  Pagination,

  // Text Component
  Paragraph,
  Title,
  BulletText,
  Text,
  S,
};

const getTreeNode = async (
  xml: string,
  buffers: Awaited<ReturnType<typeof getBufferSeals>>,
) => {
  const properties: Record<string, unknown> = {};
  const nodes = await fromString(xml, components, {
    interceptTags: ["Invoice", "Seal", "Cover", "SignMeLeft"],
    onInterceptTag: (tagName, props) => {
      if (tagName === "Invoice") {
        for (const [key, value] of Object.entries(props)) {
          properties[key] = value;
        }
        return null;
      }
      if (tagName === "Seal") {
        return React.createElement(
          Seal,
          {
            seal: buffers.seal,
            code: buffers.code,
            text: buffers.text,
          },
          [],
        );
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
  xml: string;
  buffers: Awaited<ReturnType<typeof getBufferSeals>>;
}) => {
  const { nodes, properties } = await getTreeNode(args.xml, args.buffers);
  return await withBook(nodes, properties);
};

export { run };
