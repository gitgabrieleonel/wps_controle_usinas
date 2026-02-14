import { useState, useMemo } from "react";
import { usePlants } from "@/hooks/usePlants";
import { StatsCards } from "@/components/StatsCards";
import { PlantTable } from "@/components/PlantTable";
import { QuoteTable } from "@/components/QuoteTable";
import { CompletedTable } from "@/components/CompletedTable";
import { AddQuoteDialog } from "@/components/AddQuoteDialog";
import solarLogo from "@/assets/solar-logo.png";
import { Sun, Search, CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function isPlantComplete(plant: any) {
  return (
    plant.art === "concluido" &&
    plant.parecerAcesso === "concluido" &&
    (plant.material ?? "pendente") === "concluido" &&
    (plant.estoque ?? "pendente") === "concluido" &&
    (plant.instalado ?? "pendente") === "concluido"
  );
}

const Index = () => {
  const { plants, quotes, addQuote, approveQuote, deleteQuote, updateStatus, deletePlant } = usePlants();
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [quoteDateFrom, setQuoteDateFrom] = useState<Date | undefined>();
  const [quoteDateTo, setQuoteDateTo] = useState<Date | undefined>();

  const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const matchesSearch = (item: { clientName: string; city?: string }) =>
    !search || normalize(item.clientName).includes(normalize(search)) || normalize(item.city || "").includes(normalize(search));

  const filteredQuotes = useMemo(() => {
    let result = quotes.filter(matchesSearch);
    if (quoteDateFrom) {
      const from = new Date(quoteDateFrom);
      from.setHours(0, 0, 0, 0);
      result = result.filter((q) => new Date(q.createdAt) >= from);
    }
    if (quoteDateTo) {
      const to = new Date(quoteDateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((q) => new Date(q.createdAt) <= to);
    }
    return result;
  }, [quotes, quoteDateFrom, quoteDateTo, search]);
  const activePlants = plants.filter((p) => !isPlantComplete(p));
  const completedPlants = plants.filter((p) => isPlantComplete(p));
  const filteredActive = activePlants.filter(matchesSearch);
  const filteredCompleted = useMemo(() => {
    let result = completedPlants.filter(matchesSearch);
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      result = result.filter((p) => new Date(p.createdAt) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((p) => new Date(p.createdAt) <= to);
    }
    return result;
  }, [completedPlants, dateFrom, dateTo, search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={solarLogo} alt="Solar" className="h-10 w-10 rounded-lg" />
            <div>
              <h1 className="text-xl font-heading font-bold tracking-tight flex items-center gap-2">
                Solar Control
                <Sun className="h-5 w-5 text-primary" />
              </h1>
              <p className="text-xs text-muted-foreground">Gestão de Usinas Solares</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        <Tabs defaultValue="orcamentos" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="orcamentos" className="font-heading">Orçamentos</TabsTrigger>
              <TabsTrigger value="usinas" className="font-heading">Usinas</TabsTrigger>
              <TabsTrigger value="concluidos" className="font-heading">Concluídos</TabsTrigger>
            </TabsList>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou cidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <TabsContent value="orcamentos" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !quoteDateFrom && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {quoteDateFrom ? format(quoteDateFrom, "dd/MM/yyyy") : "Data início"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={quoteDateFrom} onSelect={setQuoteDateFrom} locale={ptBR} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !quoteDateTo && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {quoteDateTo ? format(quoteDateTo, "dd/MM/yyyy") : "Data fim"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={quoteDateTo} onSelect={setQuoteDateTo} locale={ptBR} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
                {(quoteDateFrom || quoteDateTo) && (
                  <Button variant="ghost" size="sm" onClick={() => { setQuoteDateFrom(undefined); setQuoteDateTo(undefined); }}>
                    Limpar datas
                  </Button>
                )}
                <span className="text-sm text-muted-foreground">
                  {filteredQuotes.length} orçamento(s)
                </span>
              </div>
              <AddQuoteDialog onAdd={addQuote} />
            </div>
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border/50">
                <h2 className="font-heading font-semibold text-lg">Orçamentos</h2>
                <p className="text-xs text-muted-foreground">
                  Aprove um orçamento para enviá-lo à aba de Usinas
                </p>
              </div>
              <QuoteTable
                quotes={filteredQuotes}
                onApprove={approveQuote}
                onDelete={deleteQuote}
              />
            </div>
          </TabsContent>

          <TabsContent value="usinas" className="space-y-6">
            <StatsCards plants={activePlants} />
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border/50">
                <h2 className="font-heading font-semibold text-lg">Usinas em Andamento</h2>
                <p className="text-xs text-muted-foreground">
                  Quando o progresso chegar a 100%, a usina será movida para Concluídos
                </p>
              </div>
              <PlantTable
                plants={filteredActive}
                onUpdateStatus={updateStatus}
                onDelete={deletePlant}
              />
            </div>
          </TabsContent>

          <TabsContent value="concluidos" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Data início"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} locale={ptBR} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy") : "Data fim"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} locale={ptBR} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              {(dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" onClick={() => { setDateFrom(undefined); setDateTo(undefined); }}>
                  Limpar datas
                </Button>
              )}
              <span className="text-sm text-muted-foreground ml-auto">
                {filteredCompleted.length} usina(s) encontrada(s)
              </span>
            </div>
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border/50">
                <h2 className="font-heading font-semibold text-lg">Usinas Concluídas</h2>
                <p className="text-xs text-muted-foreground">
                  Filtre por período para saber quantas foram instaladas
                </p>
              </div>
              <CompletedTable
                plants={filteredCompleted}
                onDelete={deletePlant}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
