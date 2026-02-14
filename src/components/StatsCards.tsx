import { SolarPlant } from "@/types/plant";
import { Sun, Zap, CheckCircle2, Clock } from "lucide-react";

interface StatsCardsProps {
  plants: SolarPlant[];
}

export function StatsCards({ plants }: StatsCardsProps) {
  const totalKwh = plants.reduce((sum, p) => sum + p.kwh, 0);
  const completed = plants.filter(
    (p) =>
      p.art === "concluido" &&
      p.parecerAcesso === "concluido" &&
      p.material === "concluido" &&
      (p.estoque ?? "pendente") === "concluido" &&
      (p.instalado ?? "pendente") === "concluido"
  ).length;
  const inProgress = plants.length - completed;

  const stats = [
    {
      label: "Total de Usinas",
      value: plants.length,
      icon: Sun,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "KWH Total",
      value: totalKwh.toLocaleString("pt-BR"),
      icon: Zap,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Concluídas",
      value: completed,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Em Progresso",
      value: inProgress,
      icon: Clock,
      color: "text-muted-foreground",
      bg: "bg-muted",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card rounded-xl p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2.5 ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
