export const dynamic = "force-static";

import { Title } from "@/components/navegation/Title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Explora nuestras clases de Brazilian Jiu-Jitsu (BJJ) y programas disponibles en JSBJJ MX.",
  alternates: {
    canonical: "/servicios",
  },
};

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <Title text={"Servicios"} />
    </div>
  );
};

export default page;
