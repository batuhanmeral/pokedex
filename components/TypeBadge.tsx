import { getTypeStyle } from "@/lib/type-colors";

export default function TypeBadge({
  type,
  label,
  size = "sm",
}: {
  type: string;
  /** Görüntülenecek (çevrilmiş) tip adı */
  label: string;
  size?: "sm" | "md";
}) {
  const style = getTypeStyle(type);
  const sizeClasses =
    size === "md" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses} ${style.badge}`}
    >
      {label}
    </span>
  );
}
