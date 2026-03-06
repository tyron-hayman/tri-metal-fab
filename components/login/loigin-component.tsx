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

export default function LoginForm() {
  const [loginData, setLoginData] = React.useState<{
    username: string | null;
    password: string | null;
  }>({
    username: null,
    password: null,
  });
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const handleLogin = () => {
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
      } catch {}
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-4xl">User Login</CardTitle>
        <CardDescription>
          Welcome to the Tri-Metal Fabricators processing app.
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
              <Button type="button" onClick={handleLogin}>
                {!isSubmitting ? "Login" : <Spinner />}
              </Button>
              <Button variant="outline" type="button">
                Forgot Password
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
