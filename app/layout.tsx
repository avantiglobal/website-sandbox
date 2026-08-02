import type { Metadata } from "next";
import "./globals.css";
import { getSiteSettings } from "@/lib/content";
import { Footer, Header } from "@/components/layout";

export const metadata: Metadata = {
  title: {
    default: "Website Template",
    template: "%s · Website Template",
  },
  description: "A reusable static website template.",
};

// Chrome is content-driven (spec 0.7): navigation comes from site.yml so an
// editor can reorder or nest menu items in the CMS without a deploy from us.
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteSettings();
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header site={site} />
        <div className="flex-1">{children}</div>
        <Footer site={site} />
      </body>
    </html>
  );
}
