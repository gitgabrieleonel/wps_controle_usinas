import { SolarPlant } from "@/types/plant";
import { Trash2, Zap, Phone, MapPin, CheckCircle2, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CompletedTableProps {
  plants: SolarPlant[];
  onDelete: (id: string) => void;
}

export function CompletedTable({ plants, onDelete }: CompletedTableProps) {
  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <CheckCircle2 className="h-12 w-12 mb-4 text-success/40" />
        <p className="text-lg font-heading">Nenhuma usina concluída</p>
        <p className="text-sm">Usinas com 100% de progresso aparecerão aqui</p>
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
            <TableHead className="font-heading font-semibold text-center">KWH</TableHead>
            <TableHead className="font-heading font-semibold text-center">Valor (R$)</TableHead>
            <TableHead className="font-heading font-semibold text-center">Pagamento</TableHead>
            <TableHead className="font-heading font-semibold text-center">Data</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {plants.map((plant) => (
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
                <span className="inline-flex items-center gap-1 font-mono text-sm font-semibold text-primary">
                  <Zap className="h-3.5 w-3.5" />
                  {plant.kwh.toLocaleString("pt-BR")}
                </span>
              </TableCell>
              <TableCell className="text-center font-mono text-sm font-semibold">
                {plant.budgetValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </TableCell>
              <TableCell className="text-center text-sm">{plant.paymentTerm}</TableCell>
              <TableCell className="text-center text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {plant.createdAt ? format(new Date(plant.createdAt), "dd/MM/yyyy") : "—"}
                </span>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
