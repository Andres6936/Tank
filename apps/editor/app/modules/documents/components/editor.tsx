import { xml } from "@codemirror/lang-xml";
import { Prec, EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import {
  abbreviationTracker,
  expandAbbreviation,
} from "@emmetio/codemirror6-plugin";
import CodeMirror from "@uiw/react-codemirror";
import { useViewContext } from "~/modules/documents/context/view-context";

const emmetTabKeymap = Prec.highest(
  keymap.of([
    {
      key: "Tab",
      run: expandAbbreviation,
    },
  ]),
);

export const Editor = () => {
  const { content, isSealed, onDirtyChange, onContentChange, injectEditor } =
    useViewContext();

  return (
    <CodeMirror
      value={content}
      onChange={(val) => {
        onContentChange(val);
        onDirtyChange(true);
      }}
      onCreateEditor={(view) => injectEditor(view)}
      extensions={[
        xml(),
        abbreviationTracker(),
        emmetTabKeymap,
        EditorState.readOnly.of(isSealed),
      ]}
      height="100%"
      className="h-full"
    />
  );
};
