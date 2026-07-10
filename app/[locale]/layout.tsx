import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";
import {
  defaultLocale,
  getDictionary,
  isLocale,
  locales,
  type Locale,
} from "@/lib/i18n";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function resolveLocale(
  params: LayoutProps["params"],
): Promise<Locale> {
  const { locale } = await params;
  return isLocale(locale) ? locale : defaultLocale;
}

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return {
    title: {
      default: "Pokedex",
      template: "%s | Pokedex",
    },
    description: dict.meta.description,
  };
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar locale={locale} dict={dict} />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8 sm:px-6">
              {children}
            </main>
            <footer className="border-t border-slate-200/70 py-6 text-center text-xs text-slate-400 dark:border-neutral-800/70 dark:text-neutral-500">
              Pokedex © {new Date().getFullYear()}
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
