import type { Metadata } from "next";
import { SobreView } from "../components/SobreView";

export const metadata: Metadata = {
  title: "DIV — Sobre",
  description:
    "Um estúdio obcecado por consistência: design systems sólidos e front-ends rápidos, legíveis por humanos e por agentes.",
};

export default function Page() {
  return <SobreView />;
}
