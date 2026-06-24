import { redirect } from "next/navigation";
import ResultClient from "./ResultClient";
import { scoreSeller, type Category, type ScoreInput, type SellerRank } from "@/lib/scoring";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams;
  if (!params.rank) redirect("/");

  const input: ScoreInput = {
    rank: getString(params.rank, "none") as SellerRank,
    category: getString(params.category, "other") as Category,
    salesCount: getNumber(params.salesCount),
    rating: getNumber(params.rating),
    ratingCount: getNumber(params.ratingCount),
    proCertified: getBoolean(params.proCertified),
    identityVerified: getBoolean(params.identityVerified),
    ndaAvailable: getBoolean(params.ndaAvailable),
    price: getNumber(params.price),
    reviewCount: getNumber(params.reviewCount),
    reviewText: getString(params.reviewText, ""),
    description: getString(params.description, ""),
  };

  const result = scoreSeller(input);
  return <ResultClient input={input} result={result} />;
}

function getString(
  value: string | string[] | undefined,
  fallback: string,
): string {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

function getNumber(value: string | string[] | undefined): number {
  const number = Number(getString(value, "0"));
  return Number.isFinite(number) ? number : 0;
}

function getBoolean(value: string | string[] | undefined): boolean {
  return getString(value, "") === "true";
}
