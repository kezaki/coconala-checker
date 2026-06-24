"use client";

import Link from "next/link";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import {
  BREAKDOWN_LABELS,
  CATEGORY_LABELS,
  RANK_LABELS,
  toChartData,
  type ScoreInput,
  type ScoreResult,
} from "@/lib/scoring";

type Props = {
  input: ScoreInput;
  result: ScoreResult;
};

export default function ResultClient({ input, result }: Props) {
  const chartData = toChartData(result.breakdown);

  return (
    <main className="min-h-screen bg-[#0F1117] px-4 py-6 text-[#E8E6E1] sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-[#2D7DD2]">
            ココナラチェッカー
          </Link>
          <Link
            href="/guide"
            className="rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300"
          >
            選び方ガイド
          </Link>
        </nav>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-white/10 bg-[#1A1C24] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Trust Score
            </p>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-7xl font-black text-white">
                {result.totalScore}
              </span>
              <span className="pb-3 text-lg text-zinc-400">/ 100</span>
            </div>
            <div className="mt-4 inline-flex items-center gap-3 rounded-md bg-[#2D7DD2]/15 px-4 py-3">
              <span className="text-sm text-zinc-300">判定ランク</span>
              <span className="text-3xl font-black text-[#2D7DD2]">
                {result.grade}
              </span>
            </div>
            <p className="mt-5 text-sm leading-7 text-zinc-300">{result.comment}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#1A1C24] p-5">
            <h2 className="text-sm font-semibold text-white">スコア内訳</h2>
            <div className="mt-3 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                  <PolarGrid stroke="#333846" />
                  <PolarAngleAxis
                    dataKey="label"
                    tick={{ fill: "#A1A1AA", fontSize: 11 }}
                  />
                  <Radar
                    dataKey="normalized"
                    fill="#2D7DD2"
                    fillOpacity={0.35}
                    stroke="#2D7DD2"
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-[#1A1C24] p-5">
            <h2 className="text-sm font-semibold text-white">入力サマリー</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Summary label="ランク" value={RANK_LABELS[input.rank]} />
              <Summary label="カテゴリ" value={CATEGORY_LABELS[input.category]} />
              <Summary label="販売実績" value={`${input.salesCount}件`} />
              <Summary label="評価" value={`${input.rating} / ${input.ratingCount}件`} />
              <Summary label="価格" value={`${input.price.toLocaleString()}円`} />
              <Summary label="口コミ数" value={`${input.reviewCount}件`} />
              <Summary label="PRO認定" value={input.proCertified ? "あり" : "なし"} />
              <Summary
                label="本人確認"
                value={input.identityVerified ? "あり" : "なし"}
              />
            </dl>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#1A1C24] p-5">
            <h2 className="text-sm font-semibold text-white">購入前アドバイス</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">{result.advice}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ShareButton href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`ココナラ出品者チェッカーで信頼度 ${result.totalScore}/100 判定${result.grade} でした`)}`}>
                Xで共有
              </ShareButton>
              <ShareButton href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent("https://example.com")}`}>
                LINEで共有
              </ShareButton>
            </div>
          </div>
        </section>

        {result.warnings.length > 0 ? (
          <section className="rounded-lg border border-[#E85D3A]/30 bg-[#1A1C24] p-5">
            <h2 className="text-sm font-semibold text-[#E85D3A]">注意フラグ</h2>
            <div className="mt-4 grid gap-3">
              {result.warnings.map((warning) => (
                <div
                  key={warning.title}
                  className="rounded-md border border-white/10 bg-[#252730] p-4"
                >
                  <p className="text-sm font-semibold text-white">{warning.title}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {warning.message}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-lg border border-white/10 bg-[#1A1C24] p-5">
          <h2 className="text-sm font-semibold text-white">詳細ポイント</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(result.breakdown).map(([key, value]) => (
              <div key={key} className="rounded-md bg-[#252730] p-4">
                <p className="text-xs text-zinc-500">
                  {BREAKDOWN_LABELS[key as keyof typeof result.breakdown]}
                </p>
                <p className="mt-2 text-2xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#252730] p-3">
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="mt-1 font-semibold text-white">{value}</dd>
    </div>
  );
}

function ShareButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-md bg-[#2D7DD2] px-4 py-2 text-sm font-semibold text-white"
    >
      {children}
    </a>
  );
}
