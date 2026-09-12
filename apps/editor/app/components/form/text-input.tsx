import { useId } from "react";
import { useField } from "@formisch/react";

import * as v from "valibot";

import type {
  FormSchema,
  FormStore,
  RequiredPath,
  ValidPath,
} from "@formisch/react";

import { Input } from "~/components/ui/input";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";

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
        aria-errormessage={`${id}-error`}
      />
      {field.errors && (
        <FieldError
          errors={field.errors.map((message) => ({ message }))}
          id={`${id}-error`}
        />
      )}
    </Field>
  );
};

export { TextInput };
