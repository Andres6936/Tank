import * as v from "valibot";
import { Form, Field as FormischField, reset, useForm } from "@formisch/react";
import type { SubmitHandler } from "@formisch/react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useId } from "react";

const FormSchema = v.object({
  Title: v.pipe(v.string(), v.minLength(5)),
  Subject: v.pipe(v.string(), v.minLength(5)),
});

const CreateDocumentModal = (props: {
  isOpen: boolean;
  close: (param: v.InferOutput<typeof FormSchema>) => void;
  reject: (reason?: unknown) => void;
}) => {
  const formId = useId();
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      Title: "",
      Subject: "",
    },
  });

  const onSubmit: SubmitHandler<typeof FormSchema> = (values) => {
    props.close(values);
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.reject}>
      <Form of={form} id={formId} onSubmit={onSubmit}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New document</DialogTitle>
            <DialogDescription>
              Added the basic information about the new document. Click continue
              when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <FormischField of={form} path={["Subject"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="subject-2">Subject</FieldLabel>
                  <Input
                    {...field.props}
                    id="subject-2"
                    name="subject"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                  />
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
            <FormischField of={form} path={["Title"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel htmlFor="title-1">Title</FieldLabel>
                  <Input
                    {...field.props}
                    id="title-1"
                    name="title"
                    value={field.input ?? ""}
                    aria-invalid={field.errors !== null}
                  />
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" form={formId}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Form>
    </Dialog>
  );
};

export { CreateDocumentModal };
