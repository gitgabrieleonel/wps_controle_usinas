import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, CalendarIcon } from "lucide-react";
import { Quote } from "@/types/plant";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AddQuoteDialogProps {
  onAdd: (quote: Omit<Quote, "id" | "createdAt" | "approved"> & { customDate?: Date }) => void;
}

export function AddQuoteDialog({ onAdd }: AddQuoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [kwh, setKwh] = useState("");
  const [budgetValue, setBudgetValue] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("à vista");
  const [observation, setObservation] = useState("");
  const [customDate, setCustomDate] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !kwh || !budgetValue) return;

    onAdd({
      clientName: clientName.trim(),
      contact: contact.trim(),
      city: city.trim(),
      kwh: Number(kwh),
      budgetValue: Number(budgetValue),
      paymentTerm: paymentTerm.trim(),
      observation: observation.trim(),
      customDate: customDate,
    });

    setClientName("");
    setContact("");
    setCity("");
    setKwh("");
    setBudgetValue("");
    setPaymentTerm("à vista");
    setObservation("");
    setCustomDate(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-heading">
          <Plus className="h-4 w-4" />
          Novo Orçamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">Novo Orçamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nome do Cliente</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contato</Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Ex: (11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: São Paulo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kwh">KWH</Label>
              <Input
                id="kwh"
                type="number"
                value={kwh}
                onChange={(e) => setKwh(e.target.value)}
                placeholder="Ex: 500"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetValue">Valor do Orçamento (R$)</Label>
              <Input
                id="budgetValue"
                type="number"
                value={budgetValue}
                onChange={(e) => setBudgetValue(e.target.value)}
                placeholder="Ex: 25000"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentTerm">Prazo de Pagamento</Label>
              <Input
                id="paymentTerm"
                value={paymentTerm}
                onChange={(e) => setPaymentTerm(e.target.value)}
                placeholder="Ex: à vista, 3x, 12x"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Data do Orçamento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className={cn("w-full justify-start text-left font-normal", !customDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDate ? format(customDate, "dd/MM/yyyy") : "Hoje (automático)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={customDate}
                  onSelect={setCustomDate}
                  locale={ptBR}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observation">Observação</Label>
            <Textarea
              id="observation"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Observações sobre o orçamento..."
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full font-heading">
            Criar Orçamento
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
