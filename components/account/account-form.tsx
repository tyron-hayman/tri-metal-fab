"use client";
import { useUser } from "@/providers/user-provider";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserAccountForm() {
  const { user, profile } = useUser();

  return (
    <div className="w-full p-10">
      <form className="w-full">
        <div className="w-full flex flex-wrap items-start justify-between mb-20 pb-20 border-b-1 border-foreground/10 border-solid">
          <div className="w-3/12">
            <h2 className="text-3xl text-foreground font-mono">Profile</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Your person details
            </p>
          </div>
          <div className="w-8/12">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-name">Display Name</FieldLabel>
                <Input
                  id="form-name"
                  type="text"
                  placeholder="Evil Rabbit"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="form-email">Email</FieldLabel>
                <Input
                  id="form-email"
                  type="text"
                  defaultValue={user?.email}
                  placeholder="user@domain.com"
                  required
                />
              </Field>
            </FieldGroup>
          </div>
        </div>
        <div className="w-full flex flex-wrap items-start justify-between mb-20 pb-20 border-b-1 border-foreground/10 border-solid">
          <div className="w-3/12">
            <h2 className="text-3xl text-foreground font-mono">Security</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Your private account details
            </p>
          </div>
          <div className="w-8/12">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-pass">Password</FieldLabel>
                <Input id="form-pass" type="password" />
              </Field>
              <Field>
                <FieldLabel htmlFor="form-passConf">
                  Confirm Password
                </FieldLabel>
                <Input id="form-passConf" type="password" />
              </Field>
            </FieldGroup>
          </div>
        </div>
      </form>
    </div>
  );
}
