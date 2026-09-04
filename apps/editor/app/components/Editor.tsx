import CodeMirror from "@uiw/react-codemirror";
import { xml } from "@codemirror/lang-xml";
import { keymap } from "@codemirror/view";
import {
  expandAbbreviation,
  abbreviationTracker,
} from "@emmetio/codemirror6-plugin";
import { useState } from "react";
import { Prec } from "@codemirror/state";
import { useViewContext } from "~/modules/documents/context/view-context";

const initialXml = `<Document>...</Document>`;

const emmetTabKeymap = Prec.highest(
  keymap.of([
    {
      key: "Tab",
      run: expandAbbreviation,
    },
  ]),
);

export const XmlEditor = () => {
  const { content, onContentChange } = useViewContext();

  return (
    <CodeMirror
      value={content}
      onChange={(val) => onContentChange(val)}
      extensions={[xml(), abbreviationTracker(), emmetTabKeymap]}
      height="100%"
      className="h-full"
    />
  );
};
