"use client";

type AvatarProps = {
  name: string;
  avatarUrl?: string | null;
  className?: string;
  textClassName?: string;
  accent?: string;
  alt?: string;
};

const accents = [
  "#ff4d2d",
  "#48d1ff",
  "#f7b733",
  "#7bdf86",
  "#ff7f66",
  "#a5f0ff",
];

function hashAccent(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return accents[Math.abs(hash) % accents.length] ?? accents[0];
}

export function Avatar({
  name,
  avatarUrl,
  className,
  textClassName,
  accent,
  alt,
}: AvatarProps) {
  const safeName = name || "Unknown";
  const backgroundColor = accent ?? hashAccent(safeName);
  const imageClassName = ["shrink-0 rounded-full object-cover", className]
    .filter(Boolean)
    .join(" ");
  const fallbackClassName = [
    "flex shrink-0 items-center justify-center rounded-full font-bold text-black text-sm",
    className,
    textClassName,
  ]
    .filter(Boolean)
    .join(" ");

  if (avatarUrl) {
    return <img src={avatarUrl} alt={alt ?? safeName} className={imageClassName} />;
  }

  return (
    <div className={fallbackClassName} style={{ backgroundColor }}>
      {safeName.slice(0, 1)}
    </div>
  );
}
