import { PlantStatus } from "@/types/plant";
import { Check, AlertCircle } from "lucide-react";

const statusConfig: Record<PlantStatus, { label: string; className: string; icon: typeof Check }> = {
  pendente: {
    label: "Pendente",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: AlertCircle,
  },
  concluido: {
    label: "Concluído",
    className: "bg-success/10 text-success border-success/20",
    icon: Check,
  },
};

interface StatusBadgeProps {
  status: PlantStatus;
  onClick?: () => void;
}

export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig["pendente"];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </button>
  );
}
