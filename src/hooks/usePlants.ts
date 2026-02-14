import { useState, useEffect } from "react";
import { SolarPlant, PlantStatus, Quote } from "@/types/plant";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export function usePlants() {
  const [plants, setPlants] = useState<SolarPlant[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listeners
  useEffect(() => {
    const unsubPlants = onSnapshot(
      query(collection(db, "plants"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt instanceof Timestamp
            ? d.data().createdAt.toDate().toISOString()
            : d.data().createdAt || new Date().toISOString(),
        })) as SolarPlant[];
        setPlants(data);
        setLoading(false);
      }
    );

    const unsubQuotes = onSnapshot(
      query(collection(db, "quotes"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt instanceof Timestamp
            ? d.data().createdAt.toDate().toISOString()
            : d.data().createdAt || new Date().toISOString(),
        })) as Quote[];
        setQuotes(data);
      }
    );

    return () => {
      unsubPlants();
      unsubQuotes();
    };
  }, []);

  const addQuote = async (data: Omit<Quote, "id" | "createdAt" | "approved"> & { customDate?: Date }) => {
    const { customDate, ...rest } = data;
    await addDoc(collection(db, "quotes"), {
      ...rest,
      approved: false,
      createdAt: customDate ? Timestamp.fromDate(customDate) : serverTimestamp(),
    });
  };

  const approveQuote = async (id: string) => {
    const quote = quotes.find((q) => q.id === id);
    if (!quote) return;

    await addDoc(collection(db, "plants"), {
      clientName: quote.clientName,
      contact: quote.contact,
      city: quote.city,
      kwh: quote.kwh,
      budgetValue: quote.budgetValue,
      paymentTerm: quote.paymentTerm,
      observation: quote.observation,
      art: "pendente",
      parecerAcesso: "pendente",
      material: "pendente",
      estoque: "pendente",
      instalado: "pendente",
      createdAt: quote.createdAt ? Timestamp.fromDate(new Date(quote.createdAt)) : serverTimestamp(),
    });

    await deleteDoc(doc(db, "quotes", id));
  };

  const deleteQuote = async (id: string) => {
    await deleteDoc(doc(db, "quotes", id));
  };

  const updateStatus = async (id: string, field: keyof SolarPlant, status: PlantStatus) => {
    await updateDoc(doc(db, "plants", id), { [field]: status });
  };

  const deletePlant = async (id: string) => {
    await deleteDoc(doc(db, "plants", id));
  };

  return { plants, quotes, loading, addQuote, approveQuote, deleteQuote, updateStatus, deletePlant };
}
