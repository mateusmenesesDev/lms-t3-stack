import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { resetPasswordSchema } from "~/schemas/auth.schema";
import { type ResetPassword } from "~/types/auth.type";
import { isClerkAPIResponseError } from "@clerk/shared/error";
import { Link } from "lucide-react";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";

export default function ResetPasswordForm() {
  const { isLoaded, signIn, setActive } = useSignIn();

  const router = useRouter();

  const form = useForm<ResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { control, handleSubmit } = form;

  if (!isLoaded) {
    return null;
  }

  const resetPassword: SubmitHandler<ResetPassword> = async (data) => {
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        password: data.password,
        code: data.code,
      });

      if (result.status !== "complete") {
        toast.error("An error occurred. Please try again.");
        return;
      }

      await setActive({ session: result.createdSessionId });
      router.push("/");
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        toast.error(err.errors[0]?.message);
        return;
      }
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(resetPassword)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Resetar senha</CardTitle>
            <CardDescription>
              Insira o código de verificação enviado ao seu email e sua nova
              senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de verificação</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="grid gap-2">
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
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
