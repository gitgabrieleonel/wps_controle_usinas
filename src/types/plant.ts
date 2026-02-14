export type PlantStatus = "pendente" | "concluido";

export interface SolarPlant {
  id: string;
  clientName: string;
  contact: string;
  city: string;
  kwh: number;
  budgetValue: number;
  paymentTerm: string;
  observation: string;
  art: PlantStatus;
  parecerAcesso: PlantStatus;
  material: PlantStatus;
  estoque: PlantStatus;
  instalado: PlantStatus;
  createdAt: string;
}

export interface Quote {
  id: string;
  clientName: string;
  contact: string;
  city: string;
  kwh: number;
  budgetValue: number;
  paymentTerm: string;
  observation: string;
  approved: boolean;
  createdAt: string;
}
