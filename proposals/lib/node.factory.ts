// xml-to-react.ts
import React from "react";
import { DOMParser } from "@xmldom/xmldom";

export type ComponentMap = Record<string, React.ComponentType<any>>;

export interface XmlToReactOptions {
  // Por ejemplo, Text de @react-pdf/renderer para envolver contenidos de texto
  textWrapper?: React.ComponentType<{ children?: React.ReactNode }>;
  // true (default): colapsa espacios y quita saltos de línea heredados del XML
  trimText?: boolean;
  // Si aparece una etiqueta no mapeada, puedes decidir qué hacer
  onUnknownTag?: (
    tagName: string,
    node: Element,
  ) => React.ComponentType<any> | null | undefined;
  interceptTags?: string[];
  onInterceptTag?: (
    tagName: string,
    props: Record<string, unknown>,
    node: Element,
  ) => React.ReactNode | null | undefined;
  // Transforma atributos (p.ej. "true"/"false" a boolean, números a number, etc.)
  attributeTransform?: (name: string, value: string) => any;
}

function defaultAttributeTransform(_name: string, value: string): any {
  const lower = value.toLowerCase();
  if (lower === "true") return true;
  if (lower === "false") return false;
  if (!Number.isNaN(Number(value)) && value.trim() !== "") return Number(value);
  return value;
}

export function xmlToReactTree(
  xml: string,
  components: ComponentMap,
  options: XmlToReactOptions = {},
): React.ReactNode[] {
  const {
    textWrapper,
    trimText = true,
    onUnknownTag,
    interceptTags,
    onInterceptTag,
    attributeTransform = defaultAttributeTransform,
  } = options;

  const parser = new DOMParser({
    errorHandler: {
      warning() {},
      error(msg: string) {
        throw new Error(msg);
      },
      fatalError(msg: string) {
        throw new Error(msg);
      },
    },
  } as any);

  const doc = parser.parseFromString(xml, "text/xml");

  function nodeToElement(node: Node, index: number): React.ReactNode | null {
    const ELEMENT_NODE = 1;
    const TEXT_NODE = 3;

    if ((node as any).nodeType === TEXT_NODE) {
      const raw = node.nodeValue ?? "";
      const text = trimText ? raw.replace(/\s+/g, " ").trim() : raw;
      if (!text) return null;
      return textWrapper ? React.createElement(textWrapper, null, text) : text;
    }

    if ((node as any).nodeType === ELEMENT_NODE) {
      const el = node as Element;
      const tag = el.tagName;

      // props desde atributos
      const props: Record<string, unknown> = {};
      // Assign the key params to avoid warning and error to traversal the node
      props.key = index;
      for (let i = 0; i < el.attributes.length; i += 1) {
        const attr = el.attributes.item(i)!;
        props[attr.name] = attributeTransform(attr.name, attr.value);
      }

      // children
      const children: React.ReactNode[] = [];
      for (let i = 0; i < el.childNodes.length; i += 1) {
        const child = nodeToElement(el.childNodes.item(i), i);
        if (child !== null && child !== undefined) children.push(child);
      }

      // componente mapeado
      let Comp: React.ComponentType<any> | undefined = components[tag];
      if (!Comp && onUnknownTag) {
        Comp = onUnknownTag(tag, el) || undefined;
      }

      // Intercept the component and overwirte the component with the callback value
      // if the tag is in the interceptTags list
      const intercept: boolean = interceptTags
        ? interceptTags.includes(tag)
        : false;
      if (intercept && onInterceptTag) {
        // Use the spread operator for delete the 'key' property
        const { key, ...propsWithoutKey } = props;
        const node = onInterceptTag(tag, propsWithoutKey, el) || undefined;
        if (!node)
          return React.createElement(React.Fragment, { key: tag }, ...children);
        return node;
      }

      if (!Comp) {
        // Si la etiqueta no está mapeada, devolvemos sólo sus hijos
        if (children.length === 0) return null;
        return React.createElement(React.Fragment, null, ...children);
      }

      return React.createElement(Comp as any, props, ...(children as any));
    }

    // Ignora comentarios, etc.
    return null;
  }

  // Construye el árbol desde la raíz del documento (puede tener más de un nodo de primer nivel)
  const roots: React.ReactNode[] = [];
  for (let index = 0; index < doc.childNodes.length; index += 1) {
    const node = nodeToElement(doc.childNodes.item(index), index);
    if (node !== null && node !== undefined) roots.push(node);
  }
  return roots;
}

// Helper para leer desde archivo usando Bun
export async function xmlFileToReactTree(
  filePath: string,
  components: ComponentMap,
  options?: XmlToReactOptions,
): Promise<React.ReactNode[]> {
  const xml = await Bun.file(filePath).text();
  return xmlToReactTree(xml, components, options);
}
