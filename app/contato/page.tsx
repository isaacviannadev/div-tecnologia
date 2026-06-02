import type { Metadata } from "next";
import { ContatoView } from "../components/ContatoView";

export const metadata: Metadata = {
  title: "DIV — Contato",
  description:
    "Conte sobre seu projeto. Resposta em até 1 dia útil — design systems, performance e migração.",
};

export default function Page() {
  return <ContatoView />;
}
