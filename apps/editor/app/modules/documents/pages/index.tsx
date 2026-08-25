import { ChevronsUpDown, LayoutGrid, List, Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import { ActionNewDocument } from "../components/actions";
import { InfinityList } from "../components/infinity-list";

export default function Page() {
  return (
    <>
      <div>
        <ActionNewDocument />
      </div>
      <div className="flex flex-row justify-between items-center">
        <Button>
          <Plus /> New folder
        </Button>
        <div className="flex flex-row gap-4">
          <ButtonGroup>
            <Button size="icon">
              <LayoutGrid size={18} strokeWidth={1} />
            </Button>
            <Button variant="outline" size="icon">
              <List size={18} strokeWidth={1} />
            </Button>
          </ButtonGroup>

          <div className="flex flex-row gap-2 items-center">
            <p className="text-muted-foreground text-xs">Sort by</p>
            <Button variant="outline">
              Last modified <ChevronsUpDown size={18} strokeWidth={1} />
            </Button>
          </div>
        </div>
      </div>
      <InfinityList />
    </>
  );
}
