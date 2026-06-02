import type { Metadata } from "next";
import { ServicosView } from "../components/ServicosView";

export const metadata: Metadata = {
  title: "DIV — Serviços",
  description:
    "Auditoria de Design System, performance & Core Web Vitals, tokens, migração de legado, Design Ops e treinamento.",
};

export default function Page() {
  return <ServicosView />;
}
