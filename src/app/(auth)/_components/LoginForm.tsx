"use client";

import Link from "next/link";

import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/clerk-react";
import { type OAuthStrategy } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/clerk-react/errors";

import { loginSchema } from "~/schemas/auth.schema";
import { type Login } from "~/types/auth.type";

import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "~/components/ui/Form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
  });
  const { handleSubmit, control } = form;

  const { signIn, setActive, isLoaded } = useSignIn();

  if (!isLoaded) {
    return;
  }

  const onSubmit: SubmitHandler<Login> = async (data: Login) => {
    try {
      if (!signIn ?? !setActive) {
        toast.error("Algo deu errado! Tente novamente mais tarde.");
        return;
      }

      const result = await signIn?.create({
        identifier: data.email,
        password: data.password,
      });

      if (result?.status === "complete") {
        await setActive({
          session: result.createdSessionId,
        });
      }

      router.push("/");
    } catch (err) {
      console.error(err);

      if (isClerkAPIResponseError(err)) {
        toast.error(err.errors[0]?.message);
        return;
      }

      toast.error("Algo deu errado! Tente novamente mais tarde.");
    }
  };

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Insira seu email para fazer login na sua conta
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
                        <Input placeholder="janedoe@domain.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex w-full justify-between">
                        <FormLabel>Senha</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Esqueceu sua senha?
                        </Link>
                      </div>
                      <FormControl>
                        <Input type="password" {...field}></Input>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              <Button
                onClick={() => signInWith("oauth_google")}
                type="button"
                variant="outline"
                className="w-full"
              >
                Entrar com Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/signup" className="underline">
                Cadastre-se
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
