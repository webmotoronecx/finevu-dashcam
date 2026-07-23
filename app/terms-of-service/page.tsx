import type { Metadata } from "next";
import { PolicyDocument } from "@/components/PolicyDocument";
import { installationTermsMeta, installationTermsSections } from "@/lib/data/installation-terms";

export const metadata: Metadata = {
  title: "Installation Booking and Payment Terms | FineVu Australia",
  description:
    "The terms that apply when you book and pay for a FineVu product installation with AutoXtreme — bookings, payment, cancellations, warranties and your consumer rights.",
};

export default function TermsOfServicePage() {
  return (
    <PolicyDocument
      title="Installation Booking and Payment Terms"
      meta={installationTermsMeta}
      sections={installationTermsSections}
    />
  );
}
