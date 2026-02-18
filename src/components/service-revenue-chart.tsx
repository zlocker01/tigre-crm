"use client";

import { useState, useEffect } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Datos de ejemplo para el gráfico (adaptados a Jiu Jitsu)
const data = [
  { name: "Clase Principiantes", value: 5000, color: "#8884d8" },
  { name: "Clase Avanzados", value: 3000, color: "#82ca9d" },
  { name: "Clase Infantil", value: 4500, color: "#ffc658" },
  { name: "Clase Mujeres", value: 3800, color: "#ff8042" },
  { name: "Clase Competidores", value: 2500, color: "#0088fe" },
];

export function ServiceRevenueChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Skeleton className="h-[250px] w-[250px] rounded-full" />
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, "Ingresos"]}
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              borderWidth: "1px",
              borderRadius: "0.375rem",
              boxShadow:
                "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              color: "var(--foreground)",
              padding: "8px 12px",
            }}
            itemStyle={{ padding: "2px 0" }}
            labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
