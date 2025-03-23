import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nephtys - Auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen flex">
      <div className="w-1/2 flex items-center justify-center">
        <h1 className="text-3xl font-bold">Bienvenue sur Nephtys Scans</h1>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
