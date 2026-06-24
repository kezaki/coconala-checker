import Link from "next/link";

const points = [
  {
    title: "評価平均だけで決めない",
    body: "5.0でも評価数が少ない場合は判断材料が不足します。評価件数と口コミの具体性を一緒に見ましょう。",
  },
  {
    title: "ランクは入口として使う",
    body: "プラチナやゴールドは参考になりますが、カテゴリによって分布が偏ります。価格、実績、説明文も確認しましょう。",
  },
  {
    title: "相場から外れた価格に注意",
    body: "安すぎる場合は対応範囲が狭いことがあり、高すぎる場合は実績や成果物の確認が必要です。",
  },
  {
    title: "口コミは中身を見る",
    body: "「ありがとうございました」だけでなく、納期、修正対応、提案内容、成果物への言及があるかを見ます。",
  },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#0F1117] px-4 py-6 text-[#E8E6E1] sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-[#2D7DD2]">
            ココナラチェッカー
          </Link>
          <span className="text-xs text-zinc-500">非公式ツール</span>
        </nav>

        <section className="py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Buying Guide
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white">
            ココナラ出品者を選ぶ前に見るべきこと
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-300">
            ランクや星評価は便利ですが、それだけでは外注の失敗リスクを十分に下げられません。
            このチェッカーは、購入前に確認すべき材料を整理するための補助ツールです。
          </p>
        </section>

        <section className="grid gap-3">
          {points.map((point) => (
            <article
              key={point.title}
              className="rounded-lg border border-white/10 bg-[#1A1C24] p-5"
            >
              <h2 className="text-base font-semibold text-white">{point.title}</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-400">{point.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-lg border border-[#2D7DD2]/30 bg-[#1A1C24] p-5">
          <h2 className="text-base font-semibold text-white">このチェッカーでできること</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            出品者ページで確認できる情報を入力すると、実績、評価、口コミ、価格、説明文をもとに
            信頼材料と注意点を整理できます。自動取得機能は今後の有料機能として検討中です。
          </p>
        </section>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-[#2D7DD2] px-4 py-3 text-sm font-semibold text-white"
        >
          チェッカーを使う
        </Link>
      </div>
    </main>
  );
}
