import "konva/canvas-backend";
import "~/pdf/utility/register-fonts";

import React, { Fragment } from "react";
import { Document } from "@react-pdf/renderer";
import { type ComponentMap, fromString } from "~/lib/node.factory";

// Bun/Node Utility
import * as pathSystem from "node:path";

import { Indent } from "~/pdf/components/section";
import { Line, SansLine } from "~/pdf/components/cover/uuid-lines";
import { VerticalLetter } from "~/pdf/components/cover/vertical-letter";
import { Page, Seal, Section, Sign, BreBCode } from "~/pdf/components/invoices";
import { Table, Row, Cell, Header, Footer } from "~/pdf/components/table";
import {
  Paragraph,
  Title,
  BulletText,
  Text,
  Bold,
  Italic,
  S,
} from "~/pdf/components/text";

// Utility Seals Buffers
import { getBreBCode, getBufferSeals } from "~/pdf/utility/buffer-seals";

// Formatters
import { formatMoney, formatSpanishDate } from "~/lib/utils";
import { currencyToSpeech } from "../utility/speech-money";

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
  Bold,
  Italic,
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

type ParameterType =
  | { Key: string; Type: "String"; Value: string }
  | { Key: string; Type: "Number"; Value: number };

type ParamsFileType = {
  Date: string;
  AccountNumber: number;
  Value: number;
  Currency: string;
  Parameters: ParameterType[];
};

const transform = async (config: {
  input: string;
  seal: "blue" | "red" | "green";
}) => {
  const { input, seal } = config;
  const inputDirectory = input;

  const paths = {
    template: pathSystem.join(inputDirectory, "index.xml"),
    parameters: pathSystem.join(inputDirectory, "index.json"),
    pdf: pathSystem.join(inputDirectory, "index.pdf"),
    reference: pathSystem.join(inputDirectory, "reference.xml"),
  };

  const [content, params, breBCode, buffers] = await Promise.all([
    Bun.file(paths.template).text(),
    Bun.file(paths.parameters).json(),
    getBreBCode(),
    getBufferSeals({
      seal,
    }),
  ]);

  const valueSpeech = await currencyToSpeech(params.Value, params.Currency);
  let parsed = content
    .replaceAll("{{UUID.Short}}", buffers.uuid.short)
    .replaceAll("{{UUID.Long}}", buffers.uuid.long)
    .replaceAll("{{Value}}", formatMoney(params.Value, params.Currency))
    .replaceAll("{{Currency}}", params.Currency)
    .replaceAll("{{Value.Speech}}", valueSpeech)
    .replaceAll(
      "{{AccountNumber}}",
      `x${Number(params.AccountNumber).toString(16).toUpperCase()}`,
    )
    .replaceAll("{{Date}}", params.Date)
    .replaceAll("{{Date.Speech}}", formatSpanishDate(params.Date));

  for (let parameter of (params as ParamsFileType).Parameters) {
    if (parameter.Type === "String") {
      parsed = parsed.replaceAll(`{{${parameter.Key}}}`, parameter.Value);
    } else if (parameter.Type === "Number") {
      parsed = parsed.replaceAll(
        `{{${parameter.Key}}}`,
        parameter.Value.toString(),
      );
    }
  }

  return {
    xml: parsed,
    paths,
    breBCode,
    buffers,
  };
};

export { transform, run };
