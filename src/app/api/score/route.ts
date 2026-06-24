import { NextResponse } from "next/server";
import { scoreSeller, type Category, type ScoreInput, type SellerRank } from "@/lib/scoring";

const ranks: SellerRank[] = ["platinum", "gold", "silver", "bronze", "regular", "none"];
const categories: Category[] = [
  "design",
  "writing",
  "programming",
  "video",
  "music",
  "business",
  "fortune",
  "other",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = normalize(body);
    return NextResponse.json(scoreSeller(input));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "スコア計算に失敗しました。",
      },
      { status: 400 },
    );
  }
}

function normalize(body: Record<string, unknown>): ScoreInput {
  const rank = String(body.rank ?? "none") as SellerRank;
  const category = String(body.category ?? "other") as Category;
  if (!ranks.includes(rank)) throw new Error("ランクの値が不正です。");
  if (!categories.includes(category)) throw new Error("カテゴリの値が不正です。");

  return {
    rank,
    category,
    salesCount: toNumber(body.salesCount),
    rating: toNumber(body.rating),
    ratingCount: toNumber(body.ratingCount),
    proCertified: Boolean(body.proCertified),
    identityVerified: Boolean(body.identityVerified),
    ndaAvailable: Boolean(body.ndaAvailable),
    price: toNumber(body.price),
    reviewCount: toNumber(body.reviewCount),
    reviewText: String(body.reviewText ?? ""),
    description: String(body.description ?? ""),
  };
}

function toNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
