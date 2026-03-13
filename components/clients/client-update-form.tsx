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
import { useState } from "react";
import Spinner from "../global/spinner";
import { createClient } from "@/supabase/supabase-client";
import { isValidEmail } from "@/utils/tools";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccountData {
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: "active" | "inactive" | "banned";
}

export default function ClientAccountForm({
  data,
  id,
}: {
  data: TMFClients;
  id: string;
}) {
  const { user, profile } = useUser();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [accoutData, setAccountData] = useState<AccountData>({
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    phone: data.phone,
    address: data.address,
    status: data.satus as "active" | "inactive" | "banned",
  });

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);

    if (
      accoutData.firstname == "" ||
      accoutData.lastname == "" ||
      accoutData.email == "" ||
      accoutData.address == "" ||
      accoutData.phone == ""
    ) {
      toast.error("Please fill in all fiends.");
      setIsSaving(false);
      return;
    }

    if (!isValidEmail(accoutData.email as string)) {
      toast.error("Please enter a valid email.");
      setIsSaving(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tmfClients")
        .update({
          firstname: accoutData.firstname,
          lastname: accoutData.lastname,
          email: accoutData.email,
          phone: accoutData.phone,
          address: accoutData.address,
          status: accoutData.status,
        })
        .eq("id", id);

      if (error) {
        toast.error(error.message);
        setIsSaving(false);
        return;
      }

      toast.success("Account updated successfully!", {
        duration: 5000,
      });

      setIsSaving(false);
    } catch {
      toast.error("An error occured while attempting to add client.");
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full p-10">
      <form className="w-full">
        <div className="w-full flex flex-wrap items-start justify-between mb-20 pb-20 border-b-1 border-foreground/10 border-solid">
          <div className="w-3/12">
            <h2 className="text-3xl text-foreground font-mono">
              Account Information
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
                      firstname: e.currentTarget.value,
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
                      lastname: e.currentTarget.value,
                    })
                  }
                />
              </Field>
            </FieldGroup>
            <FieldGroup className="flex gap-8 flex-row mb-10">
              <Field>
                <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
                <Input
                  id="form-phone"
                  type="text"
                  defaultValue={data.phone}
                  placeholder="Evil Rabbit"
                  required
                  onChange={(e) =>
                    setAccountData({
                      ...accoutData,
                      phone: e.currentTarget.value,
                    })
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Account Status</FieldLabel>
                <Select
                  onValueChange={(value) => {
                    console.log(value);
                    setAccountData({
                      ...accoutData,
                      status: value as unknown as
                        | "active"
                        | "inactive"
                        | "banned",
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Account Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <FieldGroup className="mb-10">
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
            <FieldGroup>
              <FieldLabel htmlFor="form-address">Address</FieldLabel>
              <Textarea
                id="form-address"
                defaultValue={data.address}
                onChange={(e) =>
                  setAccountData({
                    ...accoutData,
                    address: e.currentTarget.value,
                  })
                }
                placeholder="Type your message here."
              />
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
