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
  Own as SignOwn,
  OwnSign,
  Pad as SignPad,
  PadLeft as SignPadLeft,
  PadRight as SignPadRight,
  Root as SignRoot,
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
  SignRoot,
  SignRow,
  SignOwn,
  SignPad,
  SignPadLeft,
  SignPadRight,

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
  return await xmlFileToReactTree(xmlPath, components, {
    onUnknownTag: (tagName) => {
      if (tagName === "Fragment") return Fragment;
      return null; // null = unwrap, deja sólo los children
    },
  });
};

const withBook = async (nodes: React.ReactNode) => {
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
        type="Propuesta Económica"
        title="Segunda Fase Fedelta Mall"
        month="Enero 2026"
      />

      <Paginate>
        {nodes}

        <Section style={{ flex: 1 }} wrap={false}>
          <Title size="xs" style={{ marginVertical: "1cm" }}>
            Elaborado y Firmado
          </Title>

          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Section flexDirection="row">
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

              <Section flex="1" gap="4pt" justifyContent="flex-end">
                <OwnSign />
              </Section>
            </Section>
          </View>
        </Section>
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
  const node = await getTreeNode(file);

  ReactPDF.render(await withBook(node), `./book-x.pdf`);
})();
