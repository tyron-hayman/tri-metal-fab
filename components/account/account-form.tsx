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

export default function UserAccountForm({
  data,
}: {
  data: ProfilePageQueryResult;
}) {
  const { user, profile } = useUser();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [accoutData, setAccountData] = useState<AccountData>({
    displayName: null,
    password: null,
    passwordConf: null,
    email: null,
  });

  const uploadToSupabase = async (file: File) => {
    const path = `images/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("userImages")
      .upload(path, file);
    if (error) throw error;
  };

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
    // Update display name
    if (accoutData.displayName) {
      try {
        await supabase.auth.updateUser({
          data: { display_name: accoutData.displayName },
        });
      } catch {
        toast.error(
          "There was an error updating your account. Please try again later.",
          {
            duration: 5000,
          },
        );
        setIsSaving(false);
        return;
      }
    }

    if (accoutData.email) {
      if (isValidEmail(accoutData.email)) {
        toast.error("Please enter a valid email.", {
          duration: 5000,
        });
        return;
      }
      try {
        // Update email
        await supabase.auth.updateUser({
          email: accoutData.email,
        });
      } catch {
        toast.error(
          "There was an error updating your account. Please try again later.",
          {
            duration: 5000,
          },
        );
        setIsSaving(false);
        return;
      }
    }

    if (
      accoutData.password &&
      accoutData.passwordConf &&
      accoutData.password === accoutData.passwordConf
    ) {
      try {
        // Update password
        await supabase.auth.updateUser({
          password: accoutData.password,
        });
      } catch {
        toast.error(
          "There was an error updating your account. Please try again later.",
          {
            duration: 5000,
          },
        );
        setIsSaving(false);
        return;
      }
    }

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
            <h2 className="text-3xl text-foreground font-mono">Profile</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Your person details
            </p>
          </div>
          <div className="w-8/12">
            <FieldGroup>
              <div className="w-[200px] aspect-square relative rounded-full bg-white overflow-hidden mb-10">
                <Image
                  src={`https://ui-avatars.com/api/?name=${user?.user_metadata.display_name.replace(" ", "-")}&size=256`}
                  fill
                  className="object-fill"
                  alt=""
                />
              </div>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-name">Display Name</FieldLabel>
                <Input
                  id="form-name"
                  type="text"
                  defaultValue={user?.user_metadata.display_name}
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
                <FieldLabel htmlFor="form-email">Email</FieldLabel>
                <Input
                  id="form-email"
                  type="text"
                  defaultValue={user?.email}
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
            <h2 className="text-3xl text-foreground font-mono">Security</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Your private account details
            </p>
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
              <Field>
                <FieldLabel htmlFor="form-passConf">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="form-passConf"
                  type="password"
                  onChange={(e) =>
                    setAccountData({
                      ...accoutData,
                      passwordConf: e.currentTarget.value,
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
              {data && data.formFooterContent && (
                <p className="text-sm text-[var(--muted-foreground)]">
                  {data.formFooterContent}
                </p>
              )}
            </FieldGroup>
          </div>
        </div>
      </form>
    </div>
  );
}
