"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";
import { CATEGORY_LABELS, RANK_LABELS, type Category, type ScoreInput, type SellerRank } from "@/lib/scoring";

type FormValues = {
  rank: SellerRank;
  salesCount: number;
  rating: number;
  ratingCount: number;
  proCertified: boolean;
  identityVerified: boolean;
  ndaAvailable: boolean;
  price: number;
  category: Category;
  reviewCount: number;
  reviewText: string;
  description: string;
};

const defaultValues: FormValues = {
  rank: "regular",
  salesCount: 0,
  rating: 5,
  ratingCount: 0,
  proCertified: false,
  identityVerified: true,
  ndaAvailable: false,
  price: 10000,
  category: "design",
  reviewCount: 0,
  reviewText: "",
  description: "",
};

export default function Home() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });

  async function onSubmit(values: FormValues) {
    setBusy(true);
    const payload: ScoreInput = {
      ...values,
      salesCount: Number(values.salesCount),
      rating: Number(values.rating),
      ratingCount: Number(values.ratingCount),
      price: Number(values.price),
      reviewCount: Number(values.reviewCount),
    };

    const response = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setBusy(false);
      alert("スコア計算に失敗しました。入力内容を確認してください。");
      return;
    }

    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    router.push(`/result?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-[#0F1117] px-4 py-6 text-[#E8E6E1] sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
        <nav className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Coconala Checker
            </p>
            <h1 className="mt-1 text-xl font-bold text-white">
              ココナラ出品者チェッカー
            </h1>
          </div>
          <Link
            href="/guide"
            className="rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300"
          >
            選び方ガイド
          </Link>
        </nav>

        <section className="rounded-lg border border-white/10 bg-[#1A1C24] p-5">
          <h2 className="text-lg font-bold text-white">
            出品者情報を入力して信頼度をチェック
          </h2>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            出品者のランク、評価、価格、口コミを入力して、購入前に確認したい信頼材料を整理しましょう。
          </p>
        </section>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <Panel title="基本情報">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="出品者ランク">
                <select {...register("rank")} className="field">
                  {Object.entries(RANK_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="カテゴリ">
                <select {...register("category")} className="field">
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="販売実績数">
                <input
                  {...register("salesCount", { min: 0, valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="field"
                />
              </Field>
              <Field label="サービス価格">
                <input
                  {...register("price", { min: 0, valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="field"
                />
              </Field>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Check label="PRO認定" register={register("proCertified")} />
              <Check label="本人確認あり" register={register("identityVerified")} />
              <Check label="NDA対応" register={register("ndaAvailable")} />
            </div>
          </Panel>

          <Panel title="評価情報">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="総合評価">
                <input
                  {...register("rating", {
                    min: 0,
                    max: 5,
                    valueAsNumber: true,
                    required: true,
                  })}
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  className="field"
                />
                {errors.rating ? (
                  <p className="mt-1 text-xs text-[#E85D3A]">0から5で入力してください。</p>
                ) : null}
              </Field>
              <Field label="評価件数">
                <input
                  {...register("ratingCount", { min: 0, valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="field"
                />
              </Field>
              <Field label="口コミ数">
                <input
                  {...register("reviewCount", { min: 0, valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="field"
                />
              </Field>
            </div>
          </Panel>

          <Panel title="口コミ・説明文">
            <div className="grid gap-4">
              <Field label="口コミテキスト 任意">
                <textarea
                  {...register("reviewText")}
                  className="field min-h-32 resize-y"
                  placeholder="複数の口コミを貼り付けると、具体性と多様性を簡易判定します。"
                />
              </Field>
              <Field label="サービス説明文 任意">
                <textarea
                  {...register("description")}
                  className="field min-h-32 resize-y"
                  placeholder="納期、修正回数、対応範囲、権利関係などが書かれているかを見ます。"
                />
              </Field>
            </div>
          </Panel>

          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-[#2D7DD2] px-5 py-4 text-base font-bold text-white transition hover:bg-[#2469b3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "計算中..." : "信頼度をチェックする"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#1A1C24] p-5">
      <h2 className="mb-4 text-sm font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
      {children}
    </label>
  );
}

function Check({
  label,
  register,
}: {
  label: string;
  register: UseFormRegisterReturn;
}) {
  return (
    <label className="flex min-h-12 items-center gap-3 rounded-md bg-[#252730] px-4 py-3 text-sm text-zinc-200">
      <input type="checkbox" {...register} className="h-4 w-4 accent-[#2D7DD2]" />
      {label}
    </label>
  );
}
