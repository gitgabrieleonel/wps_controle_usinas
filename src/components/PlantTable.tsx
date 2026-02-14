import { SolarPlant, PlantStatus } from "@/types/plant";
import { StatusBadge } from "./StatusBadge";
import { Trash2, Zap, Phone, MapPin, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PlantTableProps {
  plants: SolarPlant[];
  onUpdateStatus: (id: string, field: keyof SolarPlant, newStatus: PlantStatus) => void;
  onDelete: (id: string) => void;
}

const statusFields = [
  { key: "art" as const, label: "ART" },
  { key: "parecerAcesso" as const, label: "Parecer de Acesso" },
  { key: "material" as const, label: "Material" },
  { key: "estoque" as const, label: "Estoque" },
  { key: "instalado" as const, label: "Instalado" },
];

function getProgress(plant: SolarPlant) {
  const fields = statusFields.map((f) => plant[f.key] as PlantStatus);
  const done = fields.filter((s) => s === "concluido").length;
  return Math.round((done / fields.length) * 100);
}

export function PlantTable({ plants, onUpdateStatus, onDelete }: PlantTableProps) {
  const toggleStatus = (id: string, field: keyof SolarPlant, current: PlantStatus) => {
    const next: PlantStatus = current === "pendente" ? "concluido" : "pendente";
    onUpdateStatus(id, field, next);
  };

  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Zap className="h-12 w-12 mb-4 text-primary/40" />
        <p className="text-lg font-heading">Nenhuma usina cadastrada</p>
        <p className="text-sm">Aprove um orçamento para criar uma usina</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50">
            <TableHead className="font-heading font-semibold">Cliente</TableHead>
            <TableHead className="font-heading font-semibold">Cidade</TableHead>
            <TableHead className="font-heading font-semibold text-center">Data</TableHead>
            <TableHead className="font-heading font-semibold text-center">KWH</TableHead>
            {statusFields.map((f) => (
              <TableHead key={f.key} className="font-heading font-semibold text-center">
                {f.label}
              </TableHead>
            ))}
            <TableHead className="font-heading font-semibold text-center">Progresso</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {plants.map((plant) => {
            const progress = getProgress(plant);
            return (
              <TableRow key={plant.id} className="border-border/30 hover:bg-accent/30 transition-colors">
                <TableCell>
                  <div>
                    <p className="font-medium">{plant.clientName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {plant.contact || "—"}
                    </p>
                    {plant.observation && (
                      <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1" title={plant.observation}>
                        {plant.observation}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {plant.city || "—"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {plant.createdAt ? format(new Date(plant.createdAt), "dd/MM/yyyy") : "—"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 font-mono text-sm font-semibold text-primary">
                    <Zap className="h-3.5 w-3.5" />
                    {plant.kwh.toLocaleString("pt-BR")}
                  </span>
                </TableCell>
                {statusFields.map((f) => (
                  <TableCell key={f.key} className="text-center">
                    <StatusBadge
                      status={plant[f.key] as PlantStatus}
                      onClick={() => toggleStatus(plant.id, f.key, plant[f.key] as PlantStatus)}
                    />
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor:
                            progress === 100
                              ? "hsl(var(--success))"
                              : "hsl(var(--destructive))",
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono font-semibold text-muted-foreground w-8">
                      {progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => onDelete(plant.id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
