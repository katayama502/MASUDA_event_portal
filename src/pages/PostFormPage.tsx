import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { AREAS, CATEGORIES } from "../types";
import type { Area, Category, EventType } from "../types";

const EMOJI_CHOICES = ["🧺", "🎨", "🧸", "📚", "🤝", "🏃", "🍚", "🎍", "☕", "🖌️", "🎋", "🏮", "🧘", "🎆", "✨"];
const COLOR_CHOICES = [
  { label: "オレンジ", value: "var(--color-orange-100)" },
  { label: "サン", value: "var(--color-sun-300)" },
  { label: "グリーン", value: "var(--color-green-100)" },
  { label: "スカイ", value: "var(--color-sky-100)" },
];

const RECURRENCE_PRESETS = ["毎週月曜", "毎週火曜", "毎週水曜", "毎週木曜", "毎週金曜", "毎週土曜", "毎週日曜", "毎月第1土曜", "毎月第2土曜", "毎月第1・第3金曜"];

function toDatetimeLocalValue(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(10, 0, 0, 0);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PostFormPage() {
  const { organizers, submitEvent } = useAppData();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [type, setType] = useState<EventType>("単発");
  const [recurrenceRule, setRecurrenceRule] = useState(RECURRENCE_PRESETS[0]);
  const [startLocal, setStartLocal] = useState(toDatetimeLocalValue());
  const [endLocal, setEndLocal] = useState("");
  const [area, setArea] = useState<Area>(AREAS[0]);
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [fee, setFee] = useState("");
  const [capacity, setCapacity] = useState("");
  const [applicationMethod, setApplicationMethod] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0]);
  const [color, setColor] = useState(COLOR_CHOICES[0].value);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);

  const [isFirstTime, setIsFirstTime] = useState(organizers.length === 0);
  const [organizerId, setOrganizerId] = useState(organizers[0]?.id ?? "");
  const [newOrganizerName, setNewOrganizerName] = useState("");
  const [newOrganizerContact, setNewOrganizerContact] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const requiredOk = useMemo(() => {
    const organizerOk = isFirstTime ? newOrganizerName.trim().length > 0 : organizerId.length > 0;
    return (
      title.trim().length > 0 &&
      locationName.trim().length > 0 &&
      targetAudience.trim().length > 0 &&
      fee.trim().length > 0 &&
      applicationMethod.trim().length > 0 &&
      description.trim().length > 0 &&
      startLocal.length > 0 &&
      organizerOk
    );
  }, [title, locationName, targetAudience, fee, applicationMethod, description, startLocal, isFirstTime, newOrganizerName, organizerId]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!requiredOk) {
      setError("入力必須の項目をご確認ください。");
      return;
    }
    setError("");

    const created = submitEvent({
      title: title.trim(),
      category,
      type,
      description: description.trim(),
      recurrenceRule: type === "継続" ? recurrenceRule : undefined,
      startDateTime: new Date(startLocal).toISOString(),
      endDateTime: endLocal ? new Date(endLocal).toISOString() : undefined,
      area,
      locationName: locationName.trim(),
      locationAddress: locationAddress.trim() || `島根県益田市${area}地区`,
      targetAudience: targetAudience.trim(),
      fee: fee.trim(),
      capacity: capacity ? Number(capacity) : undefined,
      applicationMethod: applicationMethod.trim(),
      imageEmoji: emoji,
      imageColor: color,
      imageUrl: imageUrl.trim() && !imagePreviewFailed ? imageUrl.trim() : undefined,
      imageAlt: title.trim(),
      organizerId: isFirstTime ? undefined : organizerId,
      newOrganizerName: isFirstTime ? newOrganizerName.trim() : undefined,
      newOrganizerContact: isFirstTime ? newOrganizerContact.trim() : undefined,
    });

    setSubmitted(true);
    window.setTimeout(() => navigate(`/events/${created.id}`), 2200);
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <span className="text-5xl">🎉</span>
        <h1 className="mt-4 font-display text-xl font-black text-ink">投稿ありがとうございます！</h1>
        <p className="mt-3 text-sm text-ink-soft">
          運営が内容を確認し、通常1〜2営業日以内に掲載されます。掲載までは「承認待ち」の状態としてマイページから確認できます。
        </p>
        <p className="mt-6 text-xs text-ink-soft">まもなく投稿内容のプレビューへ移動します…</p>
        <Link to="/mypage" className="mt-4 text-sm font-bold text-brand-600 hover:underline">
          マイページで確認する →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-6">
      <p className="text-xs font-bold uppercase tracking-wide text-brand-500">Post</p>
      <h1 className="mt-1 font-display text-2xl font-black text-ink">活動を投稿する</h1>
      <p className="mt-2 text-sm text-ink-soft">
        アカウント登録は不要です。5分ほどで入力できます。送信後は運営が内容を確認し、通常1〜2営業日以内に掲載されます。
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <Field label="タイトル" required hint="例: みえる朝市 益田川マルシェ">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="活動・イベントの名前"
          />
        </Field>

        <Field label="カテゴリ" required>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="input">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="開催形式" required>
          <div className="flex gap-2">
            {(["単発", "継続"] as EventType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${
                  type === t ? "border-brand-400 bg-brand-100 text-brand-700" : "border-brand-100 bg-white text-ink-soft"
                }`}
              >
                {t === "単発" ? "単発イベント" : "継続活動（定例）"}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-ink-soft">
            「継続活動」を選ぶと、毎週・毎月の繰り返しとして自動的に表示されます。次回以降の更新は不要です。
          </p>
        </Field>

        {type === "継続" && (
          <Field label="繰り返しルール" required hint="例: 毎週土曜、毎月第2土曜">
            <select value={recurrenceRule} onChange={(e) => setRecurrenceRule(e.target.value)} className="input">
              {RECURRENCE_PRESETS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label={type === "継続" ? "次回の開催日時" : "開催日時（開始）"} required>
          <input
            type="datetime-local"
            value={startLocal}
            onChange={(e) => setStartLocal(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="終了日時" hint="わかる場合のみ入力してください">
          <input type="datetime-local" value={endLocal} onChange={(e) => setEndLocal(e.target.value)} className="input" />
        </Field>

        <Field label="地区" required>
          <select value={area} onChange={(e) => setArea(e.target.value as Area)} className="input">
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}地区
              </option>
            ))}
          </select>
        </Field>

        <Field label="会場名" required hint="例: 益田市中央公民館">
          <input value={locationName} onChange={(e) => setLocationName(e.target.value)} className="input" />
        </Field>

        <Field label="住所" hint="例: 島根県益田市有明町◯◯">
          <input value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} className="input" />
        </Field>

        <Field label="対象" required hint="例: 未就学児と保護者、どなたでも">
          <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="input" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="参加費" required hint="例: 無料、500円">
            <input value={fee} onChange={(e) => setFee(e.target.value)} className="input" />
          </Field>
          <Field label="定員" hint="人数制限がなければ空欄">
            <input
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <Field label="申込方法" required hint="例: 予約不要、電話予約、Instagram DM">
          <input value={applicationMethod} onChange={(e) => setApplicationMethod(e.target.value)} className="input" />
        </Field>

        <Field label="説明文" required hint="どんな活動か、初めての人にもわかるように書きましょう">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="input resize-none"
          />
        </Field>

        <Field label="写真URL（任意）" hint="お手持ちの写真の公開URLを貼り付けると、絵文字の代わりに表示されます">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImagePreviewFailed(false);
            }}
            placeholder="https://..."
            className="input"
          />
          {imageUrl.trim() && (
            <div
              className="mt-2 flex h-28 w-full items-center justify-center overflow-hidden rounded-xl text-3xl"
              style={{ backgroundColor: color }}
            >
              {imagePreviewFailed ? (
                <span className="px-4 text-center text-xs font-medium text-ink-soft">
                  画像を読み込めませんでした。URLをご確認ください（絵文字が代わりに表示されます）
                </span>
              ) : (
                <img
                  src={imageUrl.trim()}
                  alt="プレビュー"
                  onError={() => setImagePreviewFailed(true)}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          )}
        </Field>

        <Field label="アイキャッチ（画像がない場合に使う絵文字）">
          <div className="flex flex-wrap gap-2">
            {EMOJI_CHOICES.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setEmoji(em)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${
                  emoji === em ? "ring-2 ring-brand-400" : "ring-1 ring-brand-100"
                }`}
                style={{ backgroundColor: color }}
              >
                {em}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            {COLOR_CHOICES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`h-7 w-7 rounded-full transition-all ${color === c.value ? "ring-2 ring-brand-500 ring-offset-2" : ""}`}
                style={{ backgroundColor: c.value }}
                aria-label={c.label}
              />
            ))}
          </div>
        </Field>

        <div className="rounded-2xl bg-brand-50 p-4">
          <p className="mb-3 text-sm font-bold text-ink">主催者情報</p>
          {organizers.length > 0 && (
            <label className="mb-3 flex items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={isFirstTime}
                onChange={(e) => setIsFirstTime(e.target.checked)}
                className="h-4 w-4 rounded border-brand-300"
              />
              はじめての投稿です（新しい主催者として登録する）
            </label>
          )}

          {isFirstTime || organizers.length === 0 ? (
            <div className="flex flex-col gap-3">
              <Field label="主催者名（団体・店舗・個人名）" required>
                <input value={newOrganizerName} onChange={(e) => setNewOrganizerName(e.target.value)} className="input" />
              </Field>
              <Field label="連絡先（非公開・運営確認用）" hint="メールアドレスなど">
                <input value={newOrganizerContact} onChange={(e) => setNewOrganizerContact(e.target.value)} className="input" />
              </Field>
            </div>
          ) : (
            <Field label="主催者を選択">
              <select value={organizerId} onChange={(e) => setOrganizerId(e.target.value)} className="input">
                {organizers.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        {error && <p className="text-sm font-medium text-alert-600">⚠️ {error}</p>}

        <button
          type="submit"
          className="pop-pressable rounded-full bg-brand-500 px-6 py-3.5 text-base font-bold text-white shadow-pop"
        >
          この内容で投稿する
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-brand-100);
          background: white;
          padding: 0.65rem 0.9rem;
          font-size: 0.875rem;
          color: var(--color-ink);
          outline: none;
        }
        .input:focus {
          border-color: var(--color-brand-500);
          box-shadow: 0 0 0 3px var(--color-brand-100);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-ink">
        {label}
        {required && <span className="text-alert-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}
