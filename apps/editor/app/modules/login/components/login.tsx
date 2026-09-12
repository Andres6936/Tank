import * as v from "valibot";
import { cn } from "cn";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useId } from "react";
import { TextInput } from "~/components/form/text-input";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "~/lib/auth-client";
import { toast } from "~/components/ui/toast";

const FormSchema = v.object({
  Email: v.pipe(v.string(), v.email()),
  Password: v.pipe(v.string(), v.minLength(8)),
});

export function LoginForm() {
  const formId = useId();
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      Email: "",
      Password: "",
    },
  });

  const mutation = useMutation({
    mutationKey: ["/login"],
    mutationFn: async (values: v.InferOutput<typeof FormSchema>) => {
      const { Email, Password } = values;
      const response = await authClient.signIn.email({
        email: Email,
        password: Password,
        callbackURL: "/documents",
        rememberMe: true,
      });
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      toast.add({
        title: "Sucess",
        description: "You are now logged in.",
      });
    },
    onError: (error) => {
      toast.add({
        title: "Error",
        description: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<typeof FormSchema> = (values) => {
    mutation.mutate(values);
  };

  return (
    <Form
      of={form}
      id={formId}
      className={cn("flex flex-col gap-6")}
      onSubmit={onSubmit}
    >
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <TextInput
              form={form}
              path={["Email"]}
              label="Email"
              placeholder="m@example.com"
            />

            <TextInput
              form={form}
              path={["Password"]}
              label="Password"
              placeholder="********"
            />
            <Field>
              <Button type="submit" form={formId}>
                Login
              </Button>
              <Button variant="outline" type="button">
                Login with Google
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="#">Sign up</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </Form>
  );
}
