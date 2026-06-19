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
  // Etiquetas cuyos hijos pueden contener texto plano (ej. 'Text' en react-pdf). Por defecto ['Text']
  textTags?: string[];
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
    textTags = ["Text"],
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

  function nodeToElement(
    node: Node,
    index: number,
    parentTag?: string,
  ): React.ReactNode | null {
    const ELEMENT_NODE = 1;
    const TEXT_NODE = 3;

    if ((node as any).nodeType === TEXT_NODE) {
      const raw = node.nodeValue ?? "";
      if (!raw) return null;

      if (trimText) {
        // Colapsamos todas las secuencias de espacios en uno solo
        const collapsed = raw.replace(/\s+/g, " ");
        let text = collapsed;

        // Si el hermano inmediato es un ELEMENTO, conservamos el espacio en ese lado
        const prevIsElement = node.previousSibling?.nodeType === ELEMENT_NODE;
        const nextIsElement = node.nextSibling?.nodeType === ELEMENT_NODE;

        if (!prevIsElement) {
          text = text.trimStart();
        }
        if (!nextIsElement) {
          text = text.trimEnd();
        }

        if (!text) return null;

        // Si el texto resultante es SOLO ESPACIOS y el padre NO es un componente de texto,
        // lo ignoramos para evitar advertencias en react-pdf u otros renderizadores
        if (text.trim() === "" && parentTag && !textTags.includes(parentTag)) {
          return null;
        }

        return textWrapper
          ? React.createElement(textWrapper, null, text)
          : text;
      } else {
        // trimText === false
        const text = raw;
        if (!text) return null;
        // También filtramos si el texto es solo espacios y el padre no admite texto
        if (text.trim() === "" && parentTag && !textTags.includes(parentTag)) {
          return null;
        }
        return textWrapper
          ? React.createElement(textWrapper, null, text)
          : text;
      }
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
        const child = nodeToElement(el.childNodes.item(i), i, tag);
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
export async function fromFile(
  filePath: string,
  components: ComponentMap,
  options?: XmlToReactOptions,
): Promise<React.ReactNode[]> {
  const xml = await Bun.file(filePath).text();
  return xmlToReactTree(xml, components, options);
}

export async function fromString(
  xml: string,
  components: ComponentMap,
  options?: XmlToReactOptions,
): Promise<React.ReactNode[]> {
  return xmlToReactTree(xml, components, options);
}
