// src/app/layout.tsx
"use client";

import { ReactNode } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css"; // or "dark"

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
