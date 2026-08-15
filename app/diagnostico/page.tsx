import type { Metadata } from "next";
import { DiagnosticoView } from "../components/DiagnosticoView";

export const metadata: Metadata = {
  title: "DIV — Diagnóstico Executivo",
  description:
    "Em 1 a 2 semanas: auditoria de Design System e performance, kit agent-ready instalado no seu repositório e roadmap priorizado. R$ 3,5k a 6k, abatido da implementação.",
};

export default function Page() {
  return <DiagnosticoView />;
}
