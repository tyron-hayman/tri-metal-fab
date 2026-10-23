"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/global/spinner";
import { createClient } from "@/supabase/supabase-client";

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasSession, setHasSession] = React.useState<boolean | null>(null);

  // Guard: only usable after /auth/confirm established a recovery session
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        toast.error("This reset link is invalid or has expired.");
        router.replace("/login");
      } else {
        setHasSession(true);
      }
    });
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password updated.");
    router.push("/dashboard");
  };

  if (!hasSession) return null;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm p-6">
      <FieldGroup>
        <Field>
          <Input
            type="password"
            placeholder="New password"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
        </Field>
        <Field>
          <Input
            type="password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            onChange={(e) => setConfirm(e.currentTarget.value)}
            required
          />
        </Field>
        <Button size="lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Update password"}
        </Button>
      </FieldGroup>
    </form>
  );
}
