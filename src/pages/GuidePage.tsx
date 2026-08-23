import { Link } from "react-router-dom";

const RESIDENT_STEPS = [
  { icon: "🔍", title: "探す", body: "トップページのタブやカテゴリ・地区で、気になる活動を絞り込みます。" },
  { icon: "📖", title: "詳しく見る", body: "イベント詳細ページで日時・場所・参加費・申込方法を確認します。" },
  { icon: "🚶", title: "参加する", body: "予約が必要な場合は主催者へ連絡し、当日は会場へ向かいましょう。" },
];

const ORGANIZER_STEPS = [
  { icon: "✍️", title: "投稿フォームに入力", body: "アカウント登録なしで投稿できます。項目ごとの入力例を見ながら5分ほどで完了します。" },
  { icon: "👀", title: "運営が内容を確認", body: "なりすまし・不適切な内容がないか、通常1〜2営業日以内に運営が確認します。" },
  { icon: "🎉", title: "掲載開始", body: "承認されると公開されます。継続活動は次回以降の更新は不要、自動で繰り返し表示されます。" },
];

export function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6">
      <p className="text-xs font-bold uppercase tracking-wide text-orange-500">Guide</p>
      <h1 className="mt-1 font-display text-2xl font-black text-ink sm:text-3xl">使い方ガイド</h1>
      <p className="mt-3 text-sm text-ink-soft">
        「ますだ日和」は、益田の活動を探す住民の方と、活動を発信したい主催者の方、それぞれにとってできるだけシンプルであることを目指しています。
      </p>

      <section className="mt-10">
        <h2 className="font-display text-lg font-black text-ink">住民の方へ：活動を探す</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {RESIDENT_STEPS.map((step, i) => (
            <div key={step.title} className="rounded-2xl bg-paper p-4 shadow-warm-sm ring-1 ring-orange-100/60">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                  {i + 1}
                </span>
                <span className="text-xl">{step.icon}</span>
              </div>
              <p className="mt-2 font-display text-sm font-bold text-ink">{step.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{step.body}</p>
            </div>
          ))}
        </div>
        <Link
          to="/"
          className="pop-pressable mt-4 inline-block rounded-full border-2 border-ink bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-pop-sm"
        >
          活動をさがしに行く →
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg font-black text-ink">主催者の方へ：活動を投稿する</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ORGANIZER_STEPS.map((step, i) => (
            <div key={step.title} className="rounded-2xl bg-green-100 p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-green-700">
                  {i + 1}
                </span>
                <span className="text-xl">{step.icon}</span>
              </div>
              <p className="mt-2 font-display text-sm font-bold text-ink">{step.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/60 p-5">
          <p className="font-display text-sm font-bold text-ink">投稿するときのちょっとしたコツ</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink-soft">
            <li>タイトルは「何をするか」がひと目でわかる言葉にしましょう（例: 「かご編み体験」より「竹かご編み体験ワークショップ」）</li>
            <li>「継続活動」を選ぶと、毎回の投稿は不要になります。まずは1回登録すれば繰り返し表示されます</li>
            <li>子どもの写真等を掲載する場合は、保護者の同意を得たうえで投稿してください</li>
            <li>迷ったときは似ている活動の投稿を参考にしてみてください</li>
          </ul>
        </div>

        <Link
          to="/post"
          className="pop-pressable mt-4 inline-block rounded-full border-2 border-ink bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-pop-sm"
        >
          活動を投稿する →
        </Link>
      </section>
    </div>
  );
}
