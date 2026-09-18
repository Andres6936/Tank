import type { FormSchema, SubmitHandler } from "@formisch/react";
import { Form, useForm } from "@formisch/react";
import { cn } from "cn";
import * as v from "valibot";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router";
import { TextInput } from "~/components/form/text-input";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Field, FieldGroup } from "~/components/ui/field";
import { Spinner } from "~/components/ui/spinner";
import { toast } from "~/components/ui/toast";
import { authClient } from "~/lib/auth-client";

const FormSchema = v.object({
  Email: v.pipe(v.string(), v.email()),
  Password: v.pipe(v.string(), v.minLength(8)),
});

export function LoginForm() {
  const navigate = useNavigate();
  const formId = useId();
  const form = useForm({
    schema: FormSchema,
    initialInput: {
      Email: "",
      Password: "",
    },
  });

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async function checkIfUserAlreadyLoggedIn() {
      try {
        const result = await authClient.getSession();
        if (result.data) {
          toast.add({
            title: "Success",
            description: "You are already logged in.",
          });
          navigate("/dashboard");
        }
      } catch (ignored) {
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const mutation = useMutation({
    mutationKey: ["/login"],
    mutationFn: async (values: v.InferOutput<typeof FormSchema>) => {
      const { Email, Password } = values;
      const response = await authClient.signIn.email({
        email: Email,
        password: Password,
        callbackURL: "/dashboard",
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
              type="password"
              placeholder="********"
            />
            <Field>
              <Button
                type="submit"
                form={formId}
                disabled={mutation.isPending || checking}
              >
                {mutation.isPending ? <Spinner /> : null}
                {mutation.isPending ? "Loading" : "Login"}
              </Button>
              <Button variant="outline" type="button">
                Login with Google
              </Button>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </Form>
  );
}
