import { Lock } from "lucide-react";
import { useViewContext } from "../context/view-context";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const Gutters = () => (
  <div className="absolute top-3 right-5">
    <Readonly />
  </div>
);

const Readonly = () => {
  const { isSealed } = useViewContext();
  if (!isSealed) return null;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="outline" size="icon">
            <Lock size={12} className="text-muted-foreground" />
          </Button>
        }
      />
      <TooltipContent>
        <p>Editing is disabled because the document is sealed.</p>
      </TooltipContent>
    </Tooltip>
  );
};

export { Gutters };
