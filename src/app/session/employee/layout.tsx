import "../globals.css";
import type React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ToastProvider } from "@/components/toast-provider";
import { branding } from "@/config/branding";
import { getLandingId } from "@/data/getLandingId";
import { DashboardLayoutEmployee } from "@/components/layout/dashboard-layout-employee";

export const metadata: Metadata = {
  title: "Dashboard de Empleado",
  description: branding.employeeDescription,
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const landingId = await getLandingId();
  if (!landingId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-bold">
          No se encontró el ID de la landing page
        </p>
      </div>
    );
  }
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ToastProvider>
        <DashboardLayoutEmployee landingId={landingId}>{children}</DashboardLayoutEmployee>
      </ToastProvider>
    </ThemeProvider>
  );
}
