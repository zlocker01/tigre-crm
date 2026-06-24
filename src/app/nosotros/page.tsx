export const dynamic = "force-static";

import { Title } from "@/components/navegation/Title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce Tigre Fitness & MMA: nuestra academia, coaches y filosofía de entrenamiento en Brazilian Jiu-Jitsu (BJJ).",
  alternates: {
    canonical: "/nosotros",
  },
};

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <Title text={"Nosotros"} />
    </div>
  );
};

export default page;

