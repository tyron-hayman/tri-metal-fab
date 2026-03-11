"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { formatedate, formatPhone } from "@/utils/tools";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/supabase-client";
import { toast } from "sonner";
import Spinner from "../global/spinner";
import { useState } from "react";
import Link from "next/link";

function ActionCell({ id, email }: { id: number; email: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const confirmDeletion = (id: number, user_email: string): void => {
    toast(
      `Are you sure you want to delete user with the email ${user_email}?`,
      {
        action: (
          <Button variant="destructive" onClick={() => deleteClient(id)}>
            Delete
          </Button>
        ),
      },
    );
  };

  const deleteClient = async (id: number) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.from("tmfClients").delete().eq("id", id);

      if (error) {
        toast.error(error.message, { duration: 5000 });
        setIsUpdating(false);
        return;
      }

      setIsUpdating(false);
      router.refresh();
    } catch {
      toast.error("An error occured while deleting the client.", {
        duration: 5000,
      });
      setIsUpdating(false);
    }
  };

  const updateClientStatus = async (
    newStatus: "active" | "banned" | "inactive",
  ): Promise<void> => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("tmfClients")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        toast.error(error.message, { duration: 5000 });
        setIsUpdating(false);
        return;
      }

      setIsUpdating(false);
      router.refresh();
    } catch {
      toast.error("An error occured while updating the client.", {
        duration: 5000,
      });
      setIsUpdating(false);
    }
  };

  return (
    <>
      {isUpdating ? (
        <Spinner classes="size-6" />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/dashboard/clients/${id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => confirmDeletion(id, email)}>
              Delete User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateClientStatus("banned")}>
              Ban User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateClientStatus("active")}>
              Set as active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateClientStatus("inactive")}>
              Set as inactive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

const clientColumns: ColumnDef<TMFClients>[] = [
  {
    accessorKey: "firstname",
    header: "First Name",
  },
  {
    accessorKey: "lastname",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ getValue }) => {
      const value = getValue();
      const phoneNumber = formatPhone(value as string);

      return phoneNumber;
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const value = getValue();

      if (value === "active") return <Badge variant="default">{value}</Badge>;
      if (value === "banned")
        return <Badge variant="destructive">{value}</Badge>;
      if (value === "inactive")
        return <Badge variant="secondary">{value}</Badge>;
      return <Badge>Active</Badge>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ getValue }) => {
      const value = getValue();
      const createdDate = formatedate(value as string);

      return createdDate;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <ActionCell
        id={row.original.id as number}
        email={row.original.email as string}
      />
    ),
  },
];

export { clientColumns };
