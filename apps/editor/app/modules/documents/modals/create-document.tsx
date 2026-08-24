import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field, FieldGroup } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const CreateDocumentModal = (props: {
  isOpen: boolean;
  close: (param: unknown) => void;
  reject: (reason?: unknown) => void;
}) => {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.close}>
      <form>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New document</DialogTitle>
            <DialogDescription>
              Added the basic information about the new document. Click continue
              when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="subject-1">Subject</Label>
              <Input id="subject-1" name="subject" />
            </Field>
            <Field>
              <Label htmlFor="title-1">Title</Label>
              <Input id="title-1" name="title" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export { CreateDocumentModal };
