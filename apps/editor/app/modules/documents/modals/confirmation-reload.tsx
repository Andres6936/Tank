import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

const ConfirmationReloadModal = (props: {
  isOpen: boolean;
  close: (param: unknown) => void;
  reject: (reason?: unknown) => void;
}) => {
  return (
    <AlertDialog open={props.isOpen} onOpenChange={props.reject}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You will lose any changes you have
            made to the document.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={props.reject}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={props.close}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ConfirmationReloadModal };
