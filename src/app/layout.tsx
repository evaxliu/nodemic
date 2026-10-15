import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nodemic",
  description: "A visual editor for compartmental epidemic models.",
  icons: {
    icon: [
      {
        url: "/nodemic-icon-transparent/nodemic-transparent-dark-512.png",
      },
      {
        url: "/nodemic-icon-transparent/nodemic-transparent-dark-512.png",
        sizes: "48x48",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
