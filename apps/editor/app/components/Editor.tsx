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

type Props = {
  content: string;
};

export const XmlEditor = (props: Props) => {
  const [value, setValue] = useState(props.content);

  return (
    <CodeMirror
      value={value}
      onChange={(val) => setValue(val)}
      extensions={[xml(), abbreviationTracker(), emmetTabKeymap]}
      height="100%"
      className="h-full"
    />
  );
};
