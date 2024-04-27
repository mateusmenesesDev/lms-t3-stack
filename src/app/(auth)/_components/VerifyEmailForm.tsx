"use client";
import { useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/shared/error";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/Button";
import { InputOTP, InputOTPSlot } from "~/components/ui/Input-otp";
import { api } from "~/trpc/react";

export default function VerifyEmailForm() {
  const user = api.user.create.useMutation();
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [code, setCode] = useState("");

  if (!isLoaded) {
    return;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (
        completeSignUp.status === "complete" &&
        completeSignUp.createdUserId &&
        completeSignUp.createdSessionId
      ) {
        await user.mutateAsync({
          userId: completeSignUp.createdUserId,
        });

        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        toast.error(err.errors[0]?.message);
        return;
      }
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleResendEmail = async () => {
    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        toast.error(err.errors[0]?.message);
        return;
      }
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4"
    >
      <h2 className="text-2xl font-bold">Verifique seu email</h2>
      <p className="text-gray-500">
        Enviamos um email para você com um link para verificar sua conta.
      </p>
      <InputOTP maxLength={6} onChange={(value) => setCode(value)}>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTP>
      <div className="flex gap-4">
        <Button
          type="submit"
          className="rounded-md bg-blue-500 py-2 text-white"
        >
          Confirmar email
        </Button>
        <Button
          type="button"
          className="rounded-md bg-blue-500 py-2 text-white"
          onClick={handleResendEmail}
        >
          Reenviar email
        </Button>
      </div>
    </form>
  );
}
