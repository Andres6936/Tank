import * as v from "valibot";
import {
  Form,
  Field as FormischField,
  useField,
  useForm,
} from "@formisch/react";
import type {
  FormSchema,
  FormStore,
  RequiredPath,
  SubmitHandler,
  ValidPath,
} from "@formisch/react";

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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useId } from "react";

const FormSchema = v.object({
  Title: v.pipe(v.string(), v.minLength(5)),
  Subject: v.pipe(v.string(), v.minLength(5)),
  Author: v.pipe(v.string(), v.minLength(5)),
  Keywords: v.pipe(v.string(), v.minLength(3)),
  Creator: v.pipe(v.string(), v.minLength(5)),
  Producer: v.pipe(v.string(), v.minLength(1)),
  Language: v.pipe(v.string(), v.minLength(1)),
  Type: v.pipe(v.string(), v.minLength(5)),
  Cover: v.pipe(v.string(), v.minLength(5)),
  Month: v.pipe(v.string(), v.minLength(5)),
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
      Author: "",
      Keywords: "",
      Creator: "",
      Producer: "",
      Language: "",
      Type: "",
      Cover: "",
      Month: "",
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
            <TextInput
              form={form}
              path={["Subject"]}
              label="Subject"
              placeholder="Subject of document"
            />
            <TextInput
              form={form}
              path={["Title"]}
              label="Title"
              placeholder="Title of document"
            />
            <TextInput
              form={form}
              path={["Author"]}
              label="Author"
              placeholder="Author of document"
            />
            <TextInput
              form={form}
              path={["Creator"]}
              label="Creator"
              placeholder="Creator of document"
            />
            <TextInput
              form={form}
              path={["Producer"]}
              label="Producer"
              placeholder="Producer of document"
            />
            <TextInput
              form={form}
              path={["Keywords"]}
              label="Keywords"
              placeholder="Values separated by comma, eg. act, contract"
            />
            <TextInput
              form={form}
              path={["Language"]}
              label="Language"
              placeholder="es | en"
            />
          </FieldGroup>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Cover</FieldLegend>
            <FieldDescription>
              Added the information about the cover
            </FieldDescription>
            <FieldGroup>
              <TextInput
                form={form}
                path={["Cover"]}
                label="Cover"
                placeholder="Title of cover"
              />
              <TextInput
                form={form}
                path={["Type"]}
                label="Type"
                placeholder="Type of cover"
              />
              <TextInput
                form={form}
                path={["Month"]}
                label="Month"
                placeholder="January 2026"
              />
            </FieldGroup>
          </FieldSet>
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

const TextInput = <
  Schema extends FormSchema,
  FieldPath extends RequiredPath,
>(props: {
  form: FormStore<Schema>;
  path: ValidPath<v.InferInput<Schema>, FieldPath>;
  label: string;
  placeholder?: string;
}) => {
  const id = useId();
  const field = useField(props.form, { path: props.path });

  return (
    <Field data-invalid={field.errors !== null}>
      <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
      <Input
        {...field.props}
        id={id}
        name={props.path.join(".")}
        placeholder={props.placeholder}
        value={(field.input as string | number | string[] | undefined) ?? ""}
        aria-invalid={field.errors !== null}
      />
      {field.errors && (
        <FieldError errors={field.errors.map((message) => ({ message }))} />
      )}
    </Field>
  );
};

export { CreateDocumentModal };
