import "../globals.css";
import type React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getLandingId } from "@/data/getLandingId";
import { getUserRole } from "@/data/getUserRole";

export const metadata: Metadata = {
  title: "Dashboard de Gestión",
  description: "Dashboard completo para la gestión de La Rochelle",
};

export default async function RootLayout({
  // You might consider renaming this function for clarity, e.g., PrivateAreaLayout
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userRole = await getUserRole();
  if (userRole !== "admin") {
    redirect("/session/employee/profile");
  }

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
    <DashboardLayout landingId={landingId}>{children}</DashboardLayout>
  );
}
