import { Loader } from "lucide-react";

export default function Spinner({ classes }: { classes?: string }) {
  return <Loader className={`animate-spin ${classes}`} />;
}
