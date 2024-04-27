"use client";

import { useSignIn } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/shared/error";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";
import { baseAuthSchema } from "~/schemas/auth.schema";
import type { BaseAuth } from "~/types/auth.type";
import ResetPasswordForm from "./ResetPasswordForm";

export function RequestResetPasswordForm() {
  const { isLoaded, signIn } = useSignIn();
  const [isRequestSuccessful, setIsRequestSuccessful] = useState(false);

  const form = useForm<BaseAuth>({
    resolver: zodResolver(baseAuthSchema),
  });

  if (!isLoaded) {
    return null;
  }

  const { control, handleSubmit } = form;

  const requestResetPassword: SubmitHandler<BaseAuth> = async (data) => {
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });
      setIsRequestSuccessful(true);
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        toast.error(err.errors[0]?.message);
        return;
      }
      toast.error("An error occurred. Please try again.");
      setIsRequestSuccessful(false);
    }
  };

  if (isRequestSuccessful) return <ResetPasswordForm />;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(requestResetPassword)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Resetar senha</CardTitle>
            <CardDescription>
              Insira seu email para resetar sua senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="jane@domain.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <Button type="submit" className="w-full">
                Resetar senha
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Lembrou sua senha?{" "}
              <Link href="/login" className="underline">
                Entrar
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
