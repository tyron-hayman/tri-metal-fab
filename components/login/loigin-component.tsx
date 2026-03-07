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
import { LoginPageQueryResult } from "@/sanity/queries";
import ThemeSwitch from "@/components/global/theme-switcher";
import { createClient } from "@/supabase/supabase-client";
import { useRouter } from "next/navigation";

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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-4xl">
          {data && data.heading ? data.heading : "User Login"}
        </CardTitle>
        <CardDescription>
          {data && data.subheading ? data.subheading : "User Login"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="small-form-name">Name</FieldLabel>
              <Input
                id="small-form-name"
                placeholder="Enter your name"
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
              <FieldLabel htmlFor="small-form-password">Password</FieldLabel>
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
            <Field orientation="horizontal">
              <Button type="button" onClick={(e) => handleLogin(e)}>
                {!isSubmitting ? "Login" : <Spinner />}
              </Button>
              <Button variant="outline" type="button">
                Forgot Password
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <ThemeSwitch />
      </CardFooter>
    </Card>
  );
}
