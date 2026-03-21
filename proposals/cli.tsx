import "konva/canvas-backend";
import "~/pdf/utility/register-fonts";

import React, { Fragment } from "react";
import ReactPDF, { Document } from "@react-pdf/renderer";
import { type ComponentMap, xmlFileToReactTree } from "~/lib/node.factory";

// Table Component
import { Table, Row, Cell, Header, Footer } from "~/pdf/components/tables";

// Text Component
import { Indent, Paginate, Section } from "~/pdf/components/section";
import {
  BulletText,
  Paragraph,
  S,
  TextJustify,
  Title,
} from "~/pdf/components/text";

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

// Argument Parser
import { object } from "@optique/core/constructs";
import { option } from "@optique/core/primitives";
import { path } from "@optique/run/valueparser";
import { run } from "@optique/run";

const components: ComponentMap = {
  Document,

  // Complex Component
  IndicatorHeader,
  Paginate,

  // Sign Component
  SignSection,
  SignRow,
  SignMeRight,

  // Table Component
  Table,
  Row,
  Cell,
  Header,
  Footer,

  // General Text Component
  Section,
  Indent,
  TextJustify,
  Title,
  BulletText,
  Paragraph,
  S,
};

const getTreeNode = async (
  xmlPath: string,
  buffers: Awaited<ReturnType<typeof getBufferSeals>>,
) => {
  const properties: Record<string, unknown> = {};
  const nodes = await xmlFileToReactTree(xmlPath, components, {
    interceptTags: ["Proposal", "Cover", "SignMeLeft"],
    onInterceptTag: (tagName, props) => {
      if (tagName === "Proposal") {
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

const parser = object({
  file: option(
    "--file",
    path({
      mustExist: true,
      type: "file",
    }),
  ),
});

const config = run(parser, {
  args: Bun.argv.slice(2),
});

(async () => {
  const file = config.file;
  const buffers = await getBufferSeals({
    seal: "blue",
  });
  const { nodes, properties } = await getTreeNode(file, buffers);
  ReactPDF.render(await withBook(nodes, properties), `./book-x.pdf`);
})();
