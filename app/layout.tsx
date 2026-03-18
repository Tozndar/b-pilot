import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B-Pilot — הטייס האישי שלך בבירוקרטיה",
  description: "עוזר חכם לניווט בבירוקרטיה הישראלית — מס, נדל\"ן, פנסיה, פיטורין, עסקים",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
