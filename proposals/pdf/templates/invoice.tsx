import "konva/canvas-backend";
import "~/pdf/utility/register-fonts";

import React, { Fragment } from "react";
import { Document } from "@react-pdf/renderer";
import { type ComponentMap, fromString } from "~/lib/node.factory";

import { Indent } from "~/pdf/components/section";
import { Line, SansLine } from "~/pdf/components/cover/uuid-lines";
import { VerticalLetter } from "~/pdf/components/cover/vertical-letter";
import { Page, Seal, Section, Sign, BreBCode } from "~/pdf/components/invoices";
import { Table, Row, Cell, Header, Footer } from "~/pdf/components/table";
import { Paragraph, Title, BulletText, Text, S } from "~/pdf/components/text";

// Utility Seals Buffers
import { getBreBCode, getBufferSeals } from "~/pdf/utility/buffer-seals";

const components: ComponentMap = {
  // Sign Component
  Line,
  Seal,
  Sign,
  SansLine,
  VerticalLetter,

  // Table Component
  Table,
  Row,
  Cell,
  Header,
  Footer,

  // Section Component
  Page,
  Section,
  Indent,

  // Text Component
  BulletText,
  Paragraph,
  Title,
  Text,
  S,
};

const getTreeNode = async (
  xml: string,
  breBCode: Awaited<ReturnType<typeof getBreBCode>>,
  buffers: Awaited<ReturnType<typeof getBufferSeals>>,
) => {
  const properties: Record<string, unknown> = {};
  const nodes = await fromString(xml, components, {
    interceptTags: ["Invoice", "Seal", "BreBCode"],
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
      if (tagName === "BreBCode") {
        return React.createElement(BreBCode, { code: breBCode }, []);
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
  breBCode: Awaited<ReturnType<typeof getBreBCode>>;
  buffers: Awaited<ReturnType<typeof getBufferSeals>>;
}) => {
  const { nodes, properties } = await getTreeNode(
    args.xml,
    args.breBCode,
    args.buffers,
  );
  return await withBook(nodes, properties);
};

export { run };
