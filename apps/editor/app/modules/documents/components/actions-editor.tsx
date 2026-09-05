import { Bold } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { useViewContext } from "../context/view-context";

const ActionBold = () => {
  const { getEditor } = useViewContext();

  const onPress = () => {
    const editor = getEditor();
    if (!editor) return;

    const { from, to } = editor.state.selection.main;
    const selectedText = editor.state.sliceDoc(from, to);
    const replacement = `<Bold>${selectedText}</Bold>`;
    editor.dispatch({
      changes: { from, to, insert: replacement },
      // Optional: Updates selection to highlight the newly formatted bold text
      selection: { anchor: from, head: from + replacement.length },
    });
    editor.focus();
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button onClick={onPress} variant="outline" size="icon">
            <Bold />
          </Button>
        }
      />
      <TooltipContent>
        <p>Apply bold to selected text</p>
      </TooltipContent>
    </Tooltip>
  );
};

export { ActionBold };
