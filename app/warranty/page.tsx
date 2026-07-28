import type { Metadata } from "next";
import { PolicyDocument } from "@/components/PolicyDocument";
import { warrantyMeta, warrantySections } from "@/lib/data/warranty";

export const metadata: Metadata = {
  title: "Warranty Policy | FineVu Australia",
  description:
    "The FineVu Australia Limited Warranty — voluntary warranty periods, what is covered, how to make a claim, and your Australian Consumer Law rights.",
};

export default function WarrantyPage() {
  return <PolicyDocument title="Warranty Policy" meta={warrantyMeta} sections={warrantySections} />;
}
