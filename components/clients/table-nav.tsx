"use client";
import { createClient } from "@/supabase/supabase-client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Plus, Tornado } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Spinner from "../global/spinner";
import { isValidEmail } from "@/utils/tools";
import { useRouter } from "next/navigation";

export default function ClientTableNav() {
  const router = useRouter();
  const supabase = createClient();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [clientData, setClientData] = useState<TMFClients>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
  });

  const addClient = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      clientData.firstname == "" ||
      clientData.lastname == "" ||
      clientData.email == "" ||
      clientData.address == "" ||
      clientData.phone == ""
    ) {
      toast.error("Please fill in all fiends.");
      setIsSubmitting(false);
      return;
    }

    if (!isValidEmail(clientData.email)) {
      toast.error("Please enter a valid email.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("tmfClients").insert({
        firstname: clientData.firstname,
        lastname: clientData.lastname,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        status: "active",
      });

      if (error) {
        toast.error(error.message);
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      setShowModal(false);

      setTimeout(() => {
        router.refresh();
      }, 750);
    } catch {
      toast.error("An error occured while attempting to add client.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-end mb-5">
      <div>
        <Button
          type="button"
          variant="default"
          onClick={(e) => setShowModal(true)}
        >
          Add Client <Plus className="size-6" />
        </Button>
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[10] bg-backround/30 backdrop-blur-xs flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-[600px] bg-[var(--card)] rounded-4xl p-10">
              <h2 className="text-2xl font-mono text-[var(--card-foreground)]">
                Add Client
                <div className="mt-10">
                  <form>
                    <FieldGroup className="flex flex-row gap-5">
                      <Field>
                        <FieldLabel htmlFor="client-form-firstname">
                          First Name
                        </FieldLabel>
                        <Input
                          id="client-form-firstname"
                          placeholder="Enter client first name"
                          required
                          onChange={(e) =>
                            setClientData({
                              ...clientData,
                              firstname: e.currentTarget.value,
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="client-form-lastname">
                          Last Name
                        </FieldLabel>
                        <Input
                          id="client-form-lastname"
                          placeholder="Enter client last name"
                          required
                          onChange={(e) =>
                            setClientData({
                              ...clientData,
                              lastname: e.currentTarget.value,
                            })
                          }
                        />
                      </Field>
                    </FieldGroup>
                    <FieldGroup className=" my-5">
                      <Field>
                        <FieldLabel htmlFor="client-form-email">
                          Email
                        </FieldLabel>
                        <Input
                          id="client-form-firstname"
                          placeholder="Enter client email"
                          required
                          onChange={(e) =>
                            setClientData({
                              ...clientData,
                              email: e.currentTarget.value,
                            })
                          }
                        />
                      </Field>
                    </FieldGroup>
                    <FieldGroup className=" my-5">
                      <Field>
                        <FieldLabel htmlFor="client-form-phone">
                          Phone
                        </FieldLabel>
                        <Input
                          id="client-form-phone"
                          placeholder="Enter client phone"
                          required
                          onChange={(e) =>
                            setClientData({
                              ...clientData,
                              phone: e.currentTarget.value,
                            })
                          }
                        />
                      </Field>
                    </FieldGroup>
                    <FieldGroup className=" my-5">
                      <Field>
                        <FieldLabel htmlFor="client-form-address">
                          Address
                        </FieldLabel>
                        <Input
                          id="client-form-address"
                          placeholder="Enter client full address"
                          required
                          onChange={(e) =>
                            setClientData({
                              ...clientData,
                              address: e.currentTarget.value,
                            })
                          }
                        />
                      </Field>
                    </FieldGroup>
                    <div className="mt-5 w-full flex justify-end">
                      <Button
                        type="button"
                        variant="default"
                        onClick={(e) => addClient(e)}
                      >
                        {!isSubmitting ? "Add" : <Spinner />}
                      </Button>
                    </div>
                  </form>
                </div>
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
