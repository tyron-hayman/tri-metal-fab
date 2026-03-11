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
import { ProfilePageQueryResult } from "@/sanity/queries";
import { useState } from "react";
import Spinner from "../global/spinner";
import { createClient } from "@/supabase/supabase-client";
import { isValidEmail } from "@/utils/tools";
import { toast } from "sonner";
import Image from "next/image";
import ImageUpload from "../global/image-uploader";

interface AccountData {
  displayName: string | null;
  password: string | null;
  passwordConf: string | null;
  email: string | null;
}

export default function ClientAccountForm({ data }: { data: TMFClients }) {
  const { user, profile } = useUser();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [accoutData, setAccountData] = useState<AccountData>({
    displayName: null,
    password: null,
    passwordConf: null,
    email: null,
  });

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);

    toast.success("Account updated successfully!", {
      duration: 5000,
    });
    setIsSaving(false);
  };

  return (
    <div className="w-full p-10">
      <form className="w-full">
        <div className="w-full flex flex-wrap items-start justify-between mb-20 pb-20 border-b-1 border-foreground/10 border-solid">
          <div className="w-3/12">
            <h2 className="text-3xl text-foreground font-mono">
              Basic Information
            </h2>
          </div>
          <div className="w-8/12">
            <FieldGroup className="flex gap-8 flex-row mb-10">
              <Field>
                <FieldLabel htmlFor="form-name">First name</FieldLabel>
                <Input
                  id="form-firstname"
                  type="text"
                  defaultValue={data.firstname}
                  placeholder="Evil Rabbit"
                  required
                  onChange={(e) =>
                    setAccountData({
                      ...accoutData,
                      displayName: e.currentTarget.value,
                    })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="form-name">Last name</FieldLabel>
                <Input
                  id="form-lastname"
                  type="text"
                  defaultValue={data.lastname}
                  placeholder="Evil Rabbit"
                  required
                  onChange={(e) =>
                    setAccountData({
                      ...accoutData,
                      displayName: e.currentTarget.value,
                    })
                  }
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-email">Email</FieldLabel>
                <Input
                  id="form-email"
                  type="text"
                  defaultValue={data.email}
                  placeholder="user@domain.com"
                  required
                  onChange={(e) =>
                    setAccountData({
                      ...accoutData,
                      email: e.currentTarget.value,
                    })
                  }
                />
              </Field>
            </FieldGroup>
          </div>
        </div>
        <div className="w-full flex flex-wrap items-start justify-between mb-20 pb-20 border-b-1 border-foreground/10 border-solid">
          <div className="w-3/12">
            <h2 className="text-3xl text-foreground font-mono">
              Account Status
            </h2>
          </div>
          <div className="w-8/12">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-pass">Password</FieldLabel>
                <Input
                  id="form-pass"
                  type="password"
                  onChange={(e) =>
                    setAccountData({
                      ...accoutData,
                      password: e.currentTarget.value,
                    })
                  }
                />
              </Field>
            </FieldGroup>
          </div>
        </div>
        <div className="w-full flex flex-wrap items-start justify-between">
          <div className="w-3/12"></div>
          <div className="w-8/12">
            <FieldGroup>
              <Button
                className="w-[200px]"
                variant="default"
                type="button"
                onClick={(e) => handleSave(e)}
              >
                {!isSaving ? "Save" : <Spinner />}
              </Button>
            </FieldGroup>
          </div>
        </div>
      </form>
    </div>
  );
}
