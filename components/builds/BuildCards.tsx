"use client";
import { createClient } from "@/supabase/supabase-client";
import { useEffect, useState } from "react";
import Spinner from "../global/spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BuildCards() {
  const [buildList, setBuildList] = useState<TMFBuilds[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    LoadProjects();
  }, []);

  const LoadProjects = async () => {
    const supabase = await createClient();
    try {
      const { data: buildList, error } = await supabase
        .from("tmfBuilds")
        .select("*");

      if (error) {
        toast.error(error.message);
        setLoading(false);
      }

      setBuildList(buildList);
      setLoading(false);
    } catch {
      toast.error("An error orccured while loading projects");
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-10">
      {loading ? (
        <BuildSkeleton />
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {buildList && buildList.length > 0 ? (
            <>
              {buildList.map((build: TMFBuilds, index: number) => {
                return <BuildCard {...build} key={build.id} />;
              })}
            </>
          ) : (
            <p className="text-base text-foreground">
              There are no builds to view.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const BuildCard = ({ id, name, clientList, status }: TMFBuilds) => {
  return (
    <div className="bg-sidebar p-5 rounded-3xl border-[var(--sidebar-border)] border-1 border-solid">
      <div className="w-full flex items-center justify-end">
        <Tooltip>
          <TooltipTrigger>
            {status == "scheduled" && (
              <Calendar className="size-4 text-amber-500" />
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{status}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <h3 className="font-mono text-foreground text-4xl text-balance font-light mb-5">
        {name}
      </h3>
      {clientList && (
        <div className="flex items-center">
          <h4 className="text-foreground text-sm font-black">Clients: </h4>
          {(clientList as unknown as TMFClients[]).map(
            (client: TMFClients, index: number) => {
              return (
                <motion.div
                  key={client.id}
                  className={`cursor-pointer w-[40px] h-[40px] rounded-full border-background border-3 border-solid bg-primary flex items-center justify-center`}
                  style={{
                    x: -10 * index,
                  }}
                  whileHover={{
                    y: -10,
                  }}
                  role="button"
                >
                  <p className="text-xs text-white font-black font-mono">
                    {client.firstname[0]}
                    {client.lastname[0]}
                  </p>
                </motion.div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
};

const BuildSkeleton = () => {
  return (
    <Card className="w-full max-w-xs rounded-2xl">
      <CardHeader>
        <Skeleton className="aspect-video w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-2/3 mb-3" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
};
