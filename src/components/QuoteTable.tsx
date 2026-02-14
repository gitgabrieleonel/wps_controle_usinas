import { Quote } from "@/types/plant";
import { Trash2, CheckCircle, FileText, Phone, MapPin, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


interface QuoteTableProps {
  quotes: Quote[];
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QuoteTable({ quotes, onApprove, onDelete }: QuoteTableProps) {
  if (quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <FileText className="h-12 w-12 mb-4 text-primary/40" />
        <p className="text-lg font-heading">Nenhum orçamento cadastrado</p>
        <p className="text-sm">Clique em "Novo Orçamento" para começar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50">
            <TableHead className="font-heading font-semibold">Cliente</TableHead>
            <TableHead className="font-heading font-semibold">Contato</TableHead>
            <TableHead className="font-heading font-semibold">Cidade</TableHead>
            <TableHead className="font-heading font-semibold text-center">KWH</TableHead>
            <TableHead className="font-heading font-semibold text-center">Valor (R$)</TableHead>
            <TableHead className="font-heading font-semibold text-center">Pagamento</TableHead>
            <TableHead className="font-heading font-semibold text-center">Data</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow key={quote.id} className="border-border/30 hover:bg-accent/30 transition-colors">
              <TableCell className="font-medium">{quote.clientName}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {quote.contact || "—"}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {quote.city || "—"}
                </span>
              </TableCell>
              <TableCell className="text-center font-mono text-sm font-semibold text-primary">
                {quote.kwh.toLocaleString("pt-BR")}
              </TableCell>
              <TableCell className="text-center font-mono text-sm font-semibold">
                {quote.budgetValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </TableCell>
              <TableCell className="text-center text-sm">{quote.paymentTerm}</TableCell>
              <TableCell className="text-center text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {quote.createdAt ? format(new Date(quote.createdAt), "dd/MM/yyyy") : "—"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onApprove(quote.id)}
                    className="h-8 w-8 p-0 text-success hover:text-success hover:bg-success/10"
                    title="Aprovar e enviar para Usinas"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <button
                    onClick={() => onDelete(quote.id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
