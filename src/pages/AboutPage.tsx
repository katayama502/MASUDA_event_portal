const VALUES = [
  { icon: "⚖️", title: "大小を対等に扱う", body: "予算や発信力の差が掲載順位に反映されないよう、すべての活動を同じカード形式で掲載します。" },
  { icon: "🔁", title: "続いている活動に光を当てる", body: "単発イベントだけでなく、毎週・毎月の継続活動を専用コーナーで見つけやすくします。" },
  { icon: "🪶", title: "投稿のハードルを低く", body: "アカウント登録不要、5分で投稿できるフォームで、発信の手間を最小限にします。" },
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6">
      <p className="text-xs font-bold uppercase tracking-wide text-brand-500">About</p>
      <h1 className="mt-1 font-display text-2xl font-black text-ink sm:text-3xl">運営について</h1>

      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        「ますだ日和」は、益田市内で行われているマルシェ・ワークショップ・親子イベント・習い事・地域活動・スポーツ大会などの情報を一か所に集め、住民のみなさんが「益田で今日・今週末・これから何があるか」を簡単に見つけられるようにする地域ポータルです。
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        情報発信力や資金力の差によって埋もれがちな、個人・小規模団体・商店の活動を住民に届け、参加や地域内交流、店舗・団体の応援につなげることを目指しています。
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-2xl bg-paper p-4 shadow-pop-sm">
            <span className="text-2xl">{v.icon}</span>
            <p className="mt-2 font-display text-sm font-bold text-ink">{v.title}</p>
            <p className="mt-1 text-sm text-ink-soft">{v.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-brand-50 p-6">
        <h2 className="font-display text-base font-bold text-ink">お問い合わせ</h2>
        <p className="mt-2 text-sm text-ink-soft">
          掲載内容の修正依頼、地域の団体・店舗の紹介、連携についてのご相談など、お気軽にお問い合わせください。
        </p>
        <p className="mt-3 text-sm font-medium text-brand-700">✉️ info@masuda-hiyori.example.jp（プロトタイプ用ダミー）</p>
      </div>

      <p className="mt-10 text-xs text-ink-soft">
        本サイトは企画書・基本設計書をもとに作成したフロントエンドのプロトタイプです。データはすべてサンプルであり、実在の団体・イベントとは関係ありません。
      </p>
    </div>
  );
}
