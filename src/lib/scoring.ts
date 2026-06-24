export type SellerRank =
  | "platinum"
  | "gold"
  | "silver"
  | "bronze"
  | "regular"
  | "none";

export type Category =
  | "design"
  | "writing"
  | "programming"
  | "video"
  | "music"
  | "business"
  | "fortune"
  | "other";

export type ScoreInput = {
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
  reviewText?: string;
  description?: string;
};

export type ScoreBreakdown = {
  salesRecord: number;
  proCertification: number;
  identityVerification: number;
  ndaAvailable: number;
  ratingQuality: number;
  reviewDepth: number;
  reviewDiversity: number;
  priceReasonability: number;
  descriptionQuality: number;
};

export type WarningFlag = {
  level: "caution" | "danger";
  title: string;
  message: string;
};

export type ScoreResult = {
  totalScore: number;
  grade: "A" | "B" | "C" | "D" | "E";
  breakdown: ScoreBreakdown;
  warnings: WarningFlag[];
  comment: string;
  advice: string;
};

export const RANK_LABELS: Record<SellerRank, string> = {
  platinum: "プラチナ",
  gold: "ゴールド",
  silver: "シルバー",
  bronze: "ブロンズ",
  regular: "レギュラー",
  none: "ランクなし",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  design: "デザイン",
  writing: "ライティング",
  programming: "プログラミング",
  video: "動画・アニメーション",
  music: "音楽・ナレーション",
  business: "ビジネス",
  fortune: "占い",
  other: "その他",
};

export const PRICE_RANGES: Record<
  Category,
  { min: number; median: number; max: number }
> = {
  design: { min: 3000, median: 15000, max: 100000 },
  writing: { min: 1000, median: 8000, max: 50000 },
  programming: { min: 5000, median: 30000, max: 200000 },
  video: { min: 5000, median: 20000, max: 150000 },
  music: { min: 3000, median: 10000, max: 80000 },
  business: { min: 3000, median: 15000, max: 100000 },
  fortune: { min: 500, median: 3000, max: 30000 },
  other: { min: 1000, median: 10000, max: 100000 },
};

export const BREAKDOWN_LABELS: Record<keyof ScoreBreakdown, string> = {
  salesRecord: "販売実績",
  proCertification: "PRO認定",
  identityVerification: "本人確認",
  ndaAvailable: "NDA対応",
  ratingQuality: "評価の質",
  reviewDepth: "口コミの具体性",
  reviewDiversity: "口コミの多様性",
  priceReasonability: "価格の相場感",
  descriptionQuality: "サービス説明",
};

const MAX_POINTS: Record<keyof ScoreBreakdown, number> = {
  salesRecord: 15,
  proCertification: 15,
  identityVerification: 5,
  ndaAvailable: 5,
  ratingQuality: 10,
  reviewDepth: 10,
  reviewDiversity: 10,
  priceReasonability: 15,
  descriptionQuality: 15,
};

export function scoreSeller(input: ScoreInput): ScoreResult {
  const clean = sanitizeInput(input);
  const breakdown: ScoreBreakdown = {
    salesRecord: scoreSales(clean.salesCount),
    proCertification: clean.proCertified ? 15 : 0,
    identityVerification: clean.identityVerified ? 5 : 0,
    ndaAvailable: clean.ndaAvailable ? 5 : 0,
    ratingQuality: scoreRating(clean.rating, clean.ratingCount),
    reviewDepth: scoreReviewDepth(clean.reviewText, clean.reviewCount),
    reviewDiversity: scoreReviewDiversity(clean.reviewText, clean.reviewCount),
    priceReasonability: scorePrice(clean.category, clean.price),
    descriptionQuality: scoreDescription(clean.description),
  };
  const totalScore = Math.round(
    Object.values(breakdown).reduce((sum, value) => sum + value, 0),
  );
  const warnings = buildWarnings(clean, breakdown);
  const grade = toGrade(totalScore);

  return {
    totalScore,
    grade,
    breakdown,
    warnings,
    comment: buildComment(totalScore, grade, warnings),
    advice: buildAdvice(clean, breakdown),
  };
}

export function toChartData(breakdown: ScoreBreakdown) {
  return Object.entries(breakdown).map(([key, value]) => {
    const typedKey = key as keyof ScoreBreakdown;
    return {
      key,
      label: BREAKDOWN_LABELS[typedKey],
      score: value,
      max: MAX_POINTS[typedKey],
      normalized: Math.round((value / MAX_POINTS[typedKey]) * 100),
    };
  });
}

function sanitizeInput(input: ScoreInput): ScoreInput {
  return {
    ...input,
    salesCount: clampNumber(input.salesCount, 0, 999999),
    rating: clampNumber(input.rating, 0, 5),
    ratingCount: clampNumber(input.ratingCount, 0, 999999),
    price: clampNumber(input.price, 0, 99999999),
    reviewCount: clampNumber(input.reviewCount, 0, 999999),
    reviewText: input.reviewText?.trim() ?? "",
    description: input.description?.trim() ?? "",
  };
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function scoreSales(count: number): number {
  if (count <= 0) return 0;
  if (count < 10) return 3;
  if (count < 50) return 7;
  if (count < 100) return 10;
  return 15;
}

function scoreRating(rating: number, count: number): number {
  if (count <= 0 || rating <= 0) return 0;
  if (rating >= 4.9 && count < 10) return 6;
  if (rating >= 4.7 && count >= 50) return 10;
  if (rating >= 4.7) return 8;
  if (rating >= 4.5) return 6;
  if (rating >= 4.0) return 4;
  return 2;
}

function scoreReviewDepth(text = "", count: number): number {
  if (!text && count <= 0) return 0;
  const concreteWords = [
    "納期",
    "修正",
    "提案",
    "成果",
    "目的",
    "要望",
    "対応",
    "具体",
    "資料",
    "デザイン",
    "文章",
    "実装",
    "納品",
  ];
  const templateWords = ["ありがとうございました", "丁寧", "迅速", "満足", "またお願いします"];
  const concreteHits = concreteWords.filter((word) => text.includes(word)).length;
  const templateHits = templateWords.filter((word) => text.includes(word)).length;
  const lengthScore = Math.min(text.length / 300, 1) * 4;
  const countScore = Math.min(count / 20, 1) * 2;
  const concreteScore = Math.min(concreteHits, 4);
  const penalty = Math.min(templateHits, 2);
  return Math.round(clampNumber(lengthScore + countScore + concreteScore - penalty, 0, 10));
}

function scoreReviewDiversity(text = "", count: number): number {
  if (count <= 0) return 0;
  const lineCount = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean).length;
  const countScore = Math.min(count / 30, 1) * 5;
  const lineScore = Math.min(lineCount / 5, 1) * 3;
  const variedWords = ["相談", "品質", "納期", "修正", "価格", "提案", "安心"];
  const varietyScore = Math.min(
    variedWords.filter((word) => text.includes(word)).length,
    2,
  );
  return Math.round(clampNumber(countScore + lineScore + varietyScore, 0, 10));
}

function scorePrice(category: Category, price: number): number {
  if (price <= 0) return 0;
  const range = PRICE_RANGES[category];
  if (price < range.median * 0.5) return 6;
  if (price > range.median * 3) return 7;
  if (price >= range.min && price <= range.max) return 15;
  return 10;
}

function scoreDescription(description = ""): number {
  if (!description) return 4;
  const markers = [
    "納期",
    "修正",
    "流れ",
    "権利",
    "実績",
    "対応",
    "購入",
    "注意",
    "できること",
    "できないこと",
  ];
  const lengthScore = Math.min(description.length / 800, 1) * 7;
  const markerScore = Math.min(
    markers.filter((word) => description.includes(word)).length,
    8,
  );
  return Math.round(clampNumber(lengthScore + markerScore, 0, 15));
}

function buildWarnings(input: ScoreInput, breakdown: ScoreBreakdown): WarningFlag[] {
  const warnings: WarningFlag[] = [];
  const range = PRICE_RANGES[input.category];
  if (input.rating >= 5 && input.ratingCount < 5) {
    warnings.push({
      level: "caution",
      title: "評価数が少ない満点評価",
      message: "評価平均は高いですが、件数が少ないため判断材料としては弱めです。",
    });
  }
  if (input.price < range.median * 0.5 && input.price > 0) {
    warnings.push({
      level: "caution",
      title: "相場よりかなり安い価格",
      message: "低価格は魅力ですが、対応範囲や修正条件を確認してください。",
    });
  }
  if (!input.identityVerified) {
    warnings.push({
      level: "danger",
      title: "本人確認が未確認",
      message: "信頼性を重視する依頼では、本人確認の有無を確認しましょう。",
    });
  }
  if (breakdown.reviewDepth <= 3 && input.reviewCount > 0) {
    warnings.push({
      level: "caution",
      title: "口コミの具体性が低め",
      message: "定型的な感想が中心の場合、実際の対応品質が見えにくいことがあります。",
    });
  }
  return warnings;
}

function toGrade(score: number): ScoreResult["grade"] {
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  if (score >= 20) return "D";
  return "E";
}

function buildComment(
  score: number,
  grade: ScoreResult["grade"],
  warnings: WarningFlag[],
): string {
  if (grade === "A") {
    return "信頼材料が多く、比較的安心して検討しやすい出品者です。条件面の最終確認をして進めましょう。";
  }
  if (grade === "B") {
    return "主要な信頼材料は揃っています。注意フラグを確認し、見積もり前に不明点を潰すと安心です。";
  }
  if (grade === "C") {
    return "判断材料がやや不足しています。価格だけで決めず、実績や対応範囲を追加確認しましょう。";
  }
  if (warnings.length >= 2) {
    return "注意点が複数あります。急ぎでなければ、他の出品者とも比較してから判断するのがおすすめです。";
  }
  return "入力情報だけでは信頼度を判断しきれません。購入前に質問し、対応内容を確認してください。";
}

function buildAdvice(input: ScoreInput, breakdown: ScoreBreakdown): string {
  const weakPoints = Object.entries(breakdown)
    .filter(([key, value]) => value / MAX_POINTS[key as keyof ScoreBreakdown] < 0.45)
    .map(([key]) => BREAKDOWN_LABELS[key as keyof ScoreBreakdown]);

  if (weakPoints.length === 0) {
    return "依頼前には、納期、修正回数、追加料金、著作権や利用範囲をメッセージで確認しましょう。";
  }

  return `${weakPoints.slice(0, 3).join("・")}が弱めです。${RANK_LABELS[input.rank]}ランクだけで判断せず、具体的な実績や対応条件を質問してから依頼すると安全です。`;
}
