import { useState } from "react";

export default function CommentForm({
  onSubmit,
}: {
  onSubmit: (text: string, images: string[]) => void;
}) {
  const [text, setText] = useState(""); // comment text
  const [image, setImage] = useState(""); // image url

  return (
    <div className="bg-card text-cardFg p-4 rounded-2xl shadow-card ring-1 ring-border">
      <textarea
        className="w-full border border-border rounded-xl p-3 text-fg text-base leading-relaxed placeholder:text-muted bg-card outline-none focus:ring-2 focus:ring-primary/30"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />

      <div className="mt-2 flex gap-2">
        <input
          className="flex-1 border border-border rounded-xl p-3 text-fg text-base placeholder:text-muted bg-card outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded-2xl bg-primary text-primaryFg disabled:opacity-50 hover:opacity-95"
          disabled={!text.trim()} // disable empty
          onClick={() => {
            onSubmit(text.trim(), image.trim() ? [image.trim()] : []); // send
            setText(""); // reset
            setImage("");
          }}
        >
          Post
        </button>
      </div>
    </div>
  );
}