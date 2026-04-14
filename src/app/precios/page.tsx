export const dynamic = "force-static";

import { Title } from "@/components/navegation/Title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precios",
  description:
    "Consulta precios, paquetes y opciones de entrenamiento en JSBJJ MX (BJJ y MMA).",
  alternates: {
    canonical: "/precios",
  },
};

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <Title text={"Precios"} />
    </div>
  );
};

export default page;
