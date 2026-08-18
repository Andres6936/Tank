import CodeMirror from "@uiw/react-codemirror";
import { xml } from "@codemirror/lang-xml";
import { keymap } from "@codemirror/view";
import {
  expandAbbreviation,
  abbreviationTracker,
} from "@emmetio/codemirror6-plugin";
import { useState } from "react";
import { Prec } from "@codemirror/state";

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
  const [value, setValue] = useState(initialXml);

  return (
    <CodeMirror
      value={value}
      onChange={(val) => setValue(val)}
      extensions={[xml(), abbreviationTracker(), emmetTabKeymap]}
      height="600px"
    />
  );
};
