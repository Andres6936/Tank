import "konva/canvas-backend";
import "~/pdf/utility/register-fonts";

import React, { Fragment } from "react";
import ReactPDF, { Document, Text, View } from "@react-pdf/renderer";
import { type ComponentMap, xmlFileToReactTree } from "~/lib/node.factory";

// Text Component
import { Indent, Paginate, Section } from "~/pdf/components/section";
import { TextJustify, Title } from "~/pdf/components/rule-content";
import { BulletText } from "~/pdf/components/bullet-text";
import { Paragraph, S } from "~/pdf/components/paragraph";

// Complex Component
import Cover from "~/pdf/components/cover";
import IndicatorHeader from "~/pdf/components/indicator-header";

// Sign Component
import {
  Section as SignSection,
  SignMe,
  Pad as SignPad,
  Row as SignRow,
} from "~/pdf/components/signs/sign-components";

// Utility Seals Buffers
import { getBufferSeals } from "~/pdf/utility/buffer-seals";

// Argument Parser
import { object } from "@optique/core/constructs";
import { option } from "@optique/core/primitives";
import { path } from "@optique/run/valueparser";
import { run } from "@optique/run";
import Seal from "~/pdf/components/cover/seal";

const components: ComponentMap = {
  Document,

  // Complex Component
  IndicatorHeader,

  // Sign Component

  // General Text Component
  Section,
  Paginate,
  Indent,
  TextJustify,
  Title,
  BulletText,
  Paragraph,
  S,
};

const getTreeNode = async (xmlPath: string) => {
  const properties: Record<string, unknown> = {};
  const nodes = await xmlFileToReactTree(xmlPath, components, {
    interceptTags: ["Proposal"],
    onInterceptTag: (tagName, props) => {
      if (tagName === "Proposal") {
        properties.title = props.title;
        properties.type = props.type;
        properties.month = props.month;
        return null;
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
) => {
  const buffers = await getBufferSeals({
    seal: "blue",
  });

  return (
    <Document>
      <Cover
        uuid={buffers.uuid}
        seal={buffers.seal}
        code={buffers.code}
        text={buffers.text}
        barcode={buffers.barcode}
        type={properties.type as string}
        title={properties.title as string}
        month={properties.month as string}
      />

      <Paginate>
        {nodes}

        <SignSection>
          <SignRow>
            <Section flex="1" gap="2pt" justifyContent="flex-end">
              <Seal
                seal={buffers.seal}
                code={buffers.code}
                text={buffers.text}
                style={{ marginTop: 0, marginBottom: "0.5cm" }}
              />
              <Text>Teléfono: +57 319 (656) 94-58</Text>
              <Text>Contacto: andres6936@live.com</Text>
            </Section>

            <SignMe />
          </SignRow>
        </SignSection>
      </Paginate>
    </Document>
  );
};

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
  const { nodes, properties } = await getTreeNode(file);
  ReactPDF.render(await withBook(nodes, properties), `./book-x.pdf`);
})();
