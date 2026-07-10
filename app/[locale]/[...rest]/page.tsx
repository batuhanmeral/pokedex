import { notFound } from "next/navigation";

/** Locale altında eşleşmeyen tüm yollar 404'e düşer. */
export default function CatchAllPage() {
  notFound();
}
