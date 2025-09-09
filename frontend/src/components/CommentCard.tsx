import { useMemo, useState } from "react";
import { format } from "date-fns";
import type { Comment } from "../types/comment";

function formatDate(iso: string) {
  try {
    return format(new Date(iso), "MMM d, yyyy • h:mm a");
  } catch {
    return iso;
  }
}

// pastel color from a string
function pastelFromString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return `hsl(${hue} 60% 92%)`;
}

// initials for avatar
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

type SmartImageProps = {
  src?: string | null;
  alt: string;
  ratio?: `${number}/${number}`; // e.g. "4/3"
  fallbackLabel?: string; // for bg/initials
  className?: string;
};

function SmartImage({
  src,
  alt,
  ratio = "4/3",
  fallbackLabel = "",
  className = "",
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [ok, setOk] = useState(Boolean(src && src.trim()));
  const showImg = ok && src;

  const bg = useMemo(() => pastelFromString(fallbackLabel || "fallback"), [fallbackLabel]);
  const inits = useMemo(() => initials(fallbackLabel || "—"), [fallbackLabel]);

  return (
    <figure className={["overflow-hidden rounded-t-2xl bg-border/20", className].join(" ")}>
        <div className="w-full relative" style={{ aspectRatio: ratio }}>
        {/* skeleton */}
        {showImg && !loaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200/70" aria-hidden />
        )}

        {/* image */}
        {showImg ? (
          <img
            src={src!}
            alt={alt}
            className="absolute inset-0 h-full w-full object-contain"
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={() => setLoaded(true)}
            onError={() => setOk(false)}
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center"
            role="img"
            aria-label="No image provided"
            style={{ background: bg }} // pastel bg
          >
            <span className="text-sm font-medium text-gray-700">No image provided</span>
          </div>
        )}
      </div>
    </figure>
  );
}

export default function CommentCard({
  c,
  onEdit,
  onDelete,
  className = "",
}: {
  c: Comment;
  onEdit: (text: string) => void;
  onDelete: () => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(c.text);
  const raw = (c.images?.[0] || "").trim();
  const [imgOk, setImgOk] = useState(!!raw);
  const img = imgOk ? raw : "";

  return (
    <article
      className={[
        // card
        "bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden",
        "hover:shadow-md transition-shadow",
        className,
      ].join(" ")}
    >
      <SmartImage
        src={(c.images?.[0] || "").trim()}
        alt={`Comment by ${c.author}`}
        ratio="4/3"
        fallbackLabel={c.author}
      />

      {/* body */}
      <div className="p-4">
        {/* meta */}
        <div className="flex items-center gap-3 text-sm">
          {/* likes */}
          <span
            className="inline-flex items-center gap-1 rounded-full bg-pink-600 text-white px-2 py-0.5 border border-black"
            title="Likes"
            data-test-id="likes-pill"
          >
            <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
              <path d="M2 10.5A3.5 3.5 0 0 1 5.5 7h2.086a1 1 0 0 0 .707-.293l2.5-2.5A2 2 0 0 1 13.914 6H15a3 3 0 0 1 3 3v1a6 6 0 0 1-6 6H6a4 4 0 0 1-4-4v-1.5Z" />
            </svg>
            {c.likes ?? 0}
          </span>

          {/* date */}
          <time className="text-gray-500" dateTime={c.created_at}>
            {formatDate(c.created_at)}
          </time>
        </div>

        {/* subtitle */}
        <h3 className="mt-2 text-gray-700">
          <span className="font-medium text-brand-fg">Comment left by {c.author}</span>
        </h3>

        {/* content */}
        {editing ? (
          <div className="mt-3">
            <textarea
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand/50 text-gray-800"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              aria-label="Edit comment text"
            />
            <div className="mt-3 flex gap-2">
              <button
                className="px-3 py-1.5 rounded-xl bg-brand text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand/50 disabled:opacity-50"
                disabled={!text.trim()}
                onClick={() => {
                  onEdit(text.trim());
                  setEditing(false);
                }}
              >
                Save
              </button>
              <button
                className="px-3 py-1.5 rounded-xl border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={() => {
                  setText(c.text);
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-gray-800 leading-relaxed">
            {c.text}
            {/* add line-clamp if plugin */}
          </p>
        )}

        {/* actions */}
        <div className="mt-4 flex items-center justify-end gap-4 text-sm">
          <button
            className="text-brand-fg hover:underline focus:outline-none focus:ring-2 focus:ring-brand/40 rounded"
            onClick={() => setEditing(true)}
            aria-label={`Edit comment by ${c.author}`}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
            onClick={onDelete}
            aria-label={`Delete comment by ${c.author}`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}