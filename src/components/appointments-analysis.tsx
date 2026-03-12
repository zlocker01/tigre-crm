"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Datos de ejemplo para los gráficos
const appointmentsByDayData = [
  { day: "Lunes", citas: 18 },
  { day: "Martes", citas: 15 },
  { day: "Miércoles", citas: 20 },
  { day: "Jueves", citas: 22 },
  { day: "Viernes", citas: 25 },
  { day: "Sábado", citas: 30 },
  { day: "Domingo", citas: 10 },
];

const appointmentsByHourData = [
  { hour: "8-9", citas: 5 },
  { hour: "9-10", citas: 8 },
  { hour: "10-11", citas: 12 },
  { hour: "11-12", citas: 15 },
  { hour: "12-13", citas: 10 },
  { hour: "13-14", citas: 7 },
  { hour: "14-15", citas: 9 },
  { hour: "15-16", citas: 14 },
  { hour: "16-17", citas: 18 },
  { hour: "17-18", citas: 20 },
  { hour: "18-19", citas: 16 },
  { hour: "19-20", citas: 8 },
];

const appointmentsByServiceData = [
  { name: "Clase Principiantes", value: 35, color: "#8884d8" },
  { name: "Clase Avanzados", value: 20, color: "#82ca9d" },
  { name: "Clase Infantil", value: 15, color: "#ffc658" },
  { name: "Clase Mujeres", value: 18, color: "#ff8042" },
  { name: "Clase Competidores", value: 12, color: "#0088fe" },
];

const appointmentStatusData = [
  { name: "Completadas", value: 75, color: "#4CAF50" },
  { name: "Canceladas", value: 15, color: "#F44336" },
  { name: "No asistidas", value: 10, color: "#FF9800" },
];

const heatmapData = [
  { x: "Lunes", y: "8-10", value: 5 },
  { x: "Lunes", y: "10-12", value: 8 },
  { x: "Lunes", y: "12-14", value: 6 },
  { x: "Lunes", y: "14-16", value: 7 },
  { x: "Lunes", y: "16-18", value: 9 },
  { x: "Lunes", y: "18-20", value: 4 },

  { x: "Martes", y: "8-10", value: 4 },
  { x: "Martes", y: "10-12", value: 7 },
  { x: "Martes", y: "12-14", value: 5 },
  { x: "Martes", y: "14-16", value: 6 },
  { x: "Martes", y: "16-18", value: 8 },
  { x: "Martes", y: "18-20", value: 3 },

  { x: "Miércoles", y: "8-10", value: 6 },
  { x: "Miércoles", y: "10-12", value: 9 },
  { x: "Miércoles", y: "12-14", value: 7 },
  { x: "Miércoles", y: "14-16", value: 8 },
  { x: "Miércoles", y: "16-18", value: 10 },
  { x: "Miércoles", y: "18-20", value: 5 },

  { x: "Jueves", y: "8-10", value: 7 },
  { x: "Jueves", y: "10-12", value: 10 },
  { x: "Jueves", y: "12-14", value: 8 },
  { x: "Jueves", y: "14-16", value: 9 },
  { x: "Jueves", y: "16-18", value: 11 },
  { x: "Jueves", y: "18-20", value: 6 },

  { x: "Viernes", y: "8-10", value: 8 },
  { x: "Viernes", y: "10-12", value: 11 },
  { x: "Viernes", y: "12-14", value: 9 },
  { x: "Viernes", y: "14-16", value: 10 },
  { x: "Viernes", y: "16-18", value: 12 },
  { x: "Viernes", y: "18-20", value: 7 },

  { x: "Sábado", y: "8-10", value: 10 },
  { x: "Sábado", y: "10-12", value: 14 },
  { x: "Sábado", y: "12-14", value: 12 },
  { x: "Sábado", y: "14-16", value: 11 },
  { x: "Sábado", y: "16-18", value: 9 },
  { x: "Sábado", y: "18-20", value: 8 },

  { x: "Domingo", y: "8-10", value: 3 },
  { x: "Domingo", y: "10-12", value: 5 },
  { x: "Domingo", y: "12-14", value: 4 },
  { x: "Domingo", y: "14-16", value: 3 },
  { x: "Domingo", y: "16-18", value: 2 },
  { x: "Domingo", y: "18-20", value: 1 },
];

// Datos para la tabla de servicios más populares
const popularServicesData = [
  {
    service: "Clase Principiantes",
    appointments: 145,
    growth: "+12%",
  },
  {
    service: "Clase Avanzados",
    appointments: 98,
    growth: "+8%",
  },
  {
    service: "Clase Infantil",
    appointments: 76,
    growth: "+15%",
  },
  {
    service: "Clase Mujeres",
    appointments: 65,
    growth: "+5%",
  },
  {
    service: "Clase Competidores",
    appointments: 54,
    growth: "+3%",
  },
];

export function AppointmentsAnalysis() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Análisis de Clases</h2>
          <p className="text-muted-foreground">
            Información detallada sobre las clases en tu academia
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período de tiempo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mes</SelectItem>
            <SelectItem value="quarter">Último trimestre</SelectItem>
            <SelectItem value="year">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Clases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">438</div>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              >
                +8.2%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                vs. mes anterior
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tasa de Asistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">89.5%</div>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              >
                +1.3%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                vs. mes anterior
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Duración Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">65 min</div>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
              >
                -2.1%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                vs. mes anterior
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="distribution">Distribución</TabsTrigger>
          <TabsTrigger value="heatmap">Mapa de Calor</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="status">Estado</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Clases por Día de la Semana</CardTitle>
                <CardDescription>
                  Distribución de clases a lo largo de la semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={appointmentsByDayData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip
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
                        formatter={(value) => [`${value} clases`, ""]}
                        itemStyle={{ padding: "2px 0" }}
                        labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                      />
                      <Legend />
                      <Bar
                        dataKey="citas"
                        name="Número de clases"
                        fill="#8884d8"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Clases por Hora</CardTitle>
                <CardDescription>
                  Distribución de clases a lo largo del día
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={appointmentsByHourData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip
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
                        formatter={(value) => [`${value} clases`, ""]}
                        itemStyle={{ padding: "2px 0" }}
                        labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                      />
                      <Legend />
                      <Bar
                        dataKey="citas"
                        name="Número de clases"
                        fill="#82ca9d"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Calor de Clases</CardTitle>
              <CardDescription>
                Visualización de las horas más ocupadas por día de la semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="x"
                      type="category"
                      name="Día"
                      allowDuplicatedCategory={false}
                    />
                    <YAxis
                      dataKey="y"
                      type="category"
                      name="Hora"
                      allowDuplicatedCategory={false}
                    />
                    <ZAxis dataKey="value" range={[100, 1000]} name="Clases" />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
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
                      formatter={(value) => [`${value} clases`, "Cantidad"]}
                      itemStyle={{ padding: "2px 0" }}
                      labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                    />
                    <Scatter data={heatmapData} fill="#8884d8" shape="circle" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-muted-foreground text-center mt-2">
                El tamaño de cada círculo representa el número de clases en ese
                horario
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Clases por Servicio</CardTitle>
                <CardDescription>
                  Distribución de clases por tipo de servicio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appointmentsByServiceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {appointmentsByServiceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
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
                        formatter={(value) => [`${value} clases`, ""]}
                        itemStyle={{ padding: "2px 0" }}
                        labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Servicios Más Populares</CardTitle>
                <CardDescription>
                  Ranking de servicios por número de clases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Servicio</TableHead>
                      <TableHead className="text-right">Clases</TableHead>
                      <TableHead className="text-right">Crecimiento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {popularServicesData.map((service) => (
                      <TableRow key={service.service}>
                        <TableCell className="font-medium">
                          {service.service}
                        </TableCell>
                        <TableCell className="text-right">
                          {service.appointments}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              service.growth.startsWith("+")
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {service.growth}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Estado de las Clases</CardTitle>
                <CardDescription>
                  Distribución de clases por estado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appointmentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {appointmentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
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
                        formatter={(value) => [`${value}%`, ""]}
                        itemStyle={{ padding: "2px 0" }}
                        labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Cancelaciones</CardTitle>
                <CardDescription>
                  Evolución de la tasa de cancelación a lo largo del tiempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Ene", tasa: 12 },
                        { month: "Feb", tasa: 15 },
                        { month: "Mar", tasa: 10 },
                        { month: "Abr", tasa: 8 },
                        { month: "May", tasa: 9 },
                        { month: "Jun", tasa: 11 },
                        { month: "Jul", tasa: 14 },
                        { month: "Ago", tasa: 13 },
                        { month: "Sep", tasa: 10 },
                        { month: "Oct", tasa: 9 },
                        { month: "Nov", tasa: 8 },
                        { month: "Dic", tasa: 7 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `${value}%`,
                          "Tasa de cancelación",
                        ]}
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
                      <Line
                        type="monotone"
                        dataKey="tasa"
                        name="Tasa de cancelación"
                        stroke="#F44336"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
