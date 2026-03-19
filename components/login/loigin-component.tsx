"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import Spinner from "../global/spinner";
import ThemeSwitch from "@/components/global/theme-switcher";
import { createClient } from "@/supabase/supabase-client";
import { useRouter } from "next/navigation";
import { LoginPageQueryResult } from "@/sanity/queries";

export default function LoginForm({ data }: { data: LoginPageQueryResult }) {
  const [loginData, setLoginData] = React.useState<{
    username: string | null;
    password: string | null;
  }>({
    username: null,
    password: null,
  });
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<boolean> => {
    e.preventDefault();
    setIsSubmitting(true);
    if (loginData.username == null || loginData.password == null) {
      toast.error("Fill in all required fields", {
        duration: 5000,
        icon: <Bell size={20} />,
      });
      setIsSubmitting(false);
      return false;
    } else {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginData.username as string,
          password: loginData.password as string,
        });

        if (error) {
          toast.error(error.message, {
            duration: 5000,
            icon: <Bell size={20} />,
          });
          setIsSubmitting(false);
          return false;
        }

        router.push("/dashboard");
      } catch {
        toast.error(
          "There was an error logging you in. Please try again soon.",
          {
            duration: 5000,
            icon: <Bell size={20} />,
          },
        );
      }
    }
    setIsSubmitting(false);
    return false;
  };

  return (
    <form>
      <FieldGroup>
        <Field>
          <Input
            id="small-form-name"
            placeholder="Enter your email"
            onChange={(e) =>
              setLoginData({
                ...loginData,
                username: e.currentTarget.value,
              })
            }
            required
          />
        </Field>
        <Field>
          <Input
            type="password"
            id="small-form-password"
            placeholder="Enter your password"
            onChange={(e) =>
              setLoginData({
                ...loginData,
                password: e.currentTarget.value,
              })
            }
            required
          />
        </Field>
        <Field orientation="horizontal" className="gap-5 mt-5">
          <Button size="lg" type="button" onClick={(e) => handleLogin(e)}>
            {!isSubmitting ? "Login" : <Spinner />}
          </Button>
          <Button size="lg" variant="outline" type="button">
            Forgot Password
          </Button>
        </Field>
        <Field className="border-t-muted border-t-1 border-solid pt-3">
          <p className="text-xs leading-relaxed text-foreground/50">
            {data.formDisclaimer}
          </p>
        </Field>
      </FieldGroup>
    </form>
  );
}
