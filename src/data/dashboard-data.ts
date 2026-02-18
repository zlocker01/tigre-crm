import type {
  MetricData,
  RevenueData,
  ClientGrowthData,
  ClientSegmentData,
  ClientRetentionData,
  ClientSatisfactionData,
  AppointmentByDayData,
  AppointmentByHourData,
  AppointmentByServiceData,
  AppointmentStatusData,
  HeatmapData,
  PopularServiceData,
  ServiceRevenueData,
  RevenueTrendData,
} from "@/interfaces/dashboard";

// Datos de métricas generales
export function getMetricsData(): MetricData[] {
  return [
    { name: "Ene", citas: 40, ingresos: 2400, clientes: 24 },
    { name: "Feb", citas: 30, ingresos: 1398, clientes: 22 },
    { name: "Mar", citas: 20, ingresos: 9800, clientes: 29 },
    { name: "Abr", citas: 27, ingresos: 3908, clientes: 20 },
    { name: "May", citas: 18, ingresos: 4800, clientes: 21 },
    { name: "Jun", citas: 23, ingresos: 3800, clientes: 25 },
    { name: "Jul", citas: 34, ingresos: 4300, clientes: 30 },
    { name: "Ago", citas: 45, ingresos: 5000, clientes: 32 },
    { name: "Sep", citas: 35, ingresos: 4000, clientes: 28 },
    { name: "Oct", citas: 30, ingresos: 3500, clientes: 26 },
    { name: "Nov", citas: 42, ingresos: 4800, clientes: 34 },
    { name: "Dic", citas: 50, ingresos: 6000, clientes: 40 },
  ];
}

// Datos de ingresos
export function getRevenueData(timeRange: "monthly" | "weekly"): RevenueData[] {
  if (timeRange === "weekly") {
    return [
      { name: "Lun", ingresos: 500, gastos: 350, beneficio: 150 },
      { name: "Mar", ingresos: 700, gastos: 450, beneficio: 250 },
      { name: "Mié", ingresos: 600, gastos: 400, beneficio: 200 },
      { name: "Jue", ingresos: 800, gastos: 500, beneficio: 300 },
      { name: "Vie", ingresos: 1200, gastos: 700, beneficio: 500 },
      { name: "Sáb", ingresos: 1500, gastos: 800, beneficio: 700 },
      { name: "Dom", ingresos: 400, gastos: 300, beneficio: 100 },
    ];
  }

  return [
    { name: "Ene", ingresos: 2400, gastos: 1800, beneficio: 600 },
    { name: "Feb", ingresos: 1398, gastos: 1200, beneficio: 198 },
    { name: "Mar", ingresos: 9800, gastos: 6500, beneficio: 3300 },
    { name: "Abr", ingresos: 3908, gastos: 2800, beneficio: 1108 },
    { name: "May", ingresos: 4800, gastos: 3200, beneficio: 1600 },
    { name: "Jun", ingresos: 3800, gastos: 2900, beneficio: 900 },
    { name: "Jul", ingresos: 4300, gastos: 3100, beneficio: 1200 },
    { name: "Ago", ingresos: 5000, gastos: 3500, beneficio: 1500 },
    { name: "Sep", ingresos: 4000, gastos: 3000, beneficio: 1000 },
    { name: "Oct", ingresos: 3500, gastos: 2700, beneficio: 800 },
    { name: "Nov", ingresos: 4800, gastos: 3300, beneficio: 1500 },
    { name: "Dic", ingresos: 6000, gastos: 4000, beneficio: 2000 },
  ];
}

// Datos de alumnos
export function getClientGrowthData(): ClientGrowthData[] {
  return [
    { month: "Ene", nuevos: 15, perdidos: 5, total: 120 },
    { month: "Feb", nuevos: 12, perdidos: 3, total: 129 },
    { month: "Mar", nuevos: 18, perdidos: 4, total: 143 },
    { month: "Abr", nuevos: 14, perdidos: 6, total: 151 },
    { month: "May", nuevos: 10, perdidos: 4, total: 157 },
    { month: "Jun", nuevos: 16, perdidos: 5, total: 168 },
    { month: "Jul", nuevos: 20, perdidos: 7, total: 181 },
    { month: "Ago", nuevos: 22, perdidos: 6, total: 197 },
    { month: "Sep", nuevos: 18, perdidos: 8, total: 207 },
    { month: "Oct", nuevos: 15, perdidos: 5, total: 217 },
    { month: "Nov", nuevos: 17, perdidos: 4, total: 230 },
    { month: "Dic", nuevos: 21, perdidos: 6, total: 245 },
  ];
}

export function getClientSegmentData(): ClientSegmentData[] {
  return [
    { name: "Nuevos (0-3 meses)", value: 65, color: "#8884d8" },
    { name: "Ocasionales (1-3 visitas/año)", value: 85, color: "#82ca9d" },
    { name: "Regulares (4-8 visitas/año)", value: 45, color: "#ffc658" },
    { name: "Frecuentes (9+ visitas/año)", value: 30, color: "#ff8042" },
    { name: "VIP (Top 10% en gasto)", value: 20, color: "#0088fe" },
  ];
}

export function getClientRetentionData(): ClientRetentionData[] {
  return [
    { month: "Ene", tasa: 92 },
    { month: "Feb", tasa: 94 },
    { month: "Mar", tasa: 91 },
    { month: "Abr", tasa: 88 },
    { month: "May", tasa: 90 },
    { month: "Jun", tasa: 93 },
    { month: "Jul", tasa: 95 },
    { month: "Ago", tasa: 94 },
    { month: "Sep", tasa: 92 },
    { month: "Oct", tasa: 91 },
    { month: "Nov", tasa: 93 },
    { month: "Dic", tasa: 96 },
  ];
}

export function getClientSatisfactionData(): ClientSatisfactionData[] {
  return [
    { aspect: "Atención", valor: 4.8, fullMark: 5 },
    { aspect: "Calidad", valor: 4.6, fullMark: 5 },
    { aspect: "Precio", valor: 4.2, fullMark: 5 },
    { aspect: "Instalaciones", valor: 4.5, fullMark: 5 },
    { aspect: "Puntualidad", valor: 4.3, fullMark: 5 },
    { aspect: "Resultados", valor: 4.7, fullMark: 5 },
  ];
}

export function getClientSourceData(): ClientSegmentData[] {
  return [
    { name: "Recomendación", value: 45, color: "#8884d8" },
    { name: "Redes sociales", value: 25, color: "#82ca9d" },
    { name: "Búsqueda web", value: 15, color: "#ffc658" },
    { name: "Publicidad local", value: 10, color: "#ff8042" },
    { name: "Otros", value: 5, color: "#0088fe" },
  ];
}

export function getClientOverviewData(): ClientSegmentData[] {
  return [
    { name: "Nuevos", value: 25, color: "#8884d8" },
    { name: "Recurrentes", value: 45, color: "#82ca9d" },
    { name: "Inactivos", value: 30, color: "#ffc658" },
  ];
}

// Datos de citas
export function getAppointmentsByDayData(): AppointmentByDayData[] {
  return [
    { day: "Lunes", citas: 18 },
    { day: "Martes", citas: 15 },
    { day: "Miércoles", citas: 20 },
    { day: "Jueves", citas: 22 },
    { day: "Viernes", citas: 25 },
    { day: "Sábado", citas: 30 },
    { day: "Domingo", citas: 10 },
  ];
}

export function getAppointmentsByHourData(): AppointmentByHourData[] {
  return [
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
}

export function getAppointmentsByServiceData(): AppointmentByServiceData[] {
  return [
    { name: "Clase Principiantes", value: 35, color: "#8884d8" },
    { name: "Clase Avanzados", value: 20, color: "#82ca9d" },
    { name: "Clase Infantil", value: 15, color: "#ffc658" },
    { name: "Clase Mujeres", value: 18, color: "#ff8042" },
    { name: "Clase Competidores", value: 12, color: "#0088fe" },
  ];
}

export function getAppointmentStatusData(): AppointmentStatusData[] {
  return [
    { name: "Completadas", value: 75, color: "#4CAF50" },
    { name: "Canceladas", value: 15, color: "#F44336" },
    { name: "No asistidas", value: 10, color: "#FF9800" },
  ];
}

export function getHeatmapData(): HeatmapData[] {
  return [
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
}

export function getPopularServicesData(): PopularServiceData[] {
  return [
    {
      service: "Clase Principiantes",
      appointments: 145,
      growth: "+12%",
      avgDuration: "45 min",
    },
    {
      service: "Clase Avanzados",
      appointments: 98,
      growth: "+8%",
      avgDuration: "60 min",
    },
    {
      service: "Clase Infantil",
      appointments: 76,
      growth: "+15%",
      avgDuration: "75 min",
    },
    {
      service: "Clase Mujeres",
      appointments: 65,
      growth: "+5%",
      avgDuration: "90 min",
    },
    {
      service: "Clase Competidores",
      appointments: 54,
      growth: "+3%",
      avgDuration: "120 min",
    },
  ];
}

// Datos de servicios
export function getServiceRevenueData(): ServiceRevenueData[] {
  return [
    { name: "Clase Principiantes", value: 5000, color: "#8884d8" },
    { name: "Clase Avanzados", value: 3000, color: "#82ca9d" },
    { name: "Clase Infantil", value: 4500, color: "#ffc658" },
    { name: "Clase Mujeres", value: 3800, color: "#ff8042" },
    { name: "Clase Competidores", value: 2500, color: "#0088fe" },
  ];
}

// Datos de tendencias
export function getRevenueTrendData(): RevenueTrendData[] {
  return [
    { month: "Ene", actual: 2400, previo: 2000, objetivo: 2500 },
    { month: "Feb", actual: 1398, previo: 1800, objetivo: 2500 },
    { month: "Mar", actual: 9800, previo: 8000, objetivo: 8500 },
    { month: "Abr", actual: 3908, previo: 3200, objetivo: 3500 },
    { month: "May", actual: 4800, previo: 4100, objetivo: 4500 },
    { month: "Jun", actual: 3800, previo: 3500, objetivo: 4000 },
    { month: "Jul", actual: 4300, previo: 3900, objetivo: 4200 },
    { month: "Ago", actual: 5000, previo: 4200, objetivo: 4800 },
    { month: "Sep", actual: 4000, previo: 3800, objetivo: 4200 },
    { month: "Oct", actual: 3500, previo: 3300, objetivo: 3800 },
    { month: "Nov", actual: 4800, previo: 4000, objetivo: 4500 },
    { month: "Dic", actual: 6000, previo: 5200, objetivo: 5500 },
  ];
}

// Datos para métricas avanzadas
export function getSatisfactionData() {
  return [
    { subject: "Atención", A: 120, B: 110, fullMark: 150 },
    { subject: "Calidad", A: 98, B: 130, fullMark: 150 },
    { subject: "Precio", A: 86, B: 130, fullMark: 150 },
    { subject: "Ambiente", A: 99, B: 100, fullMark: 150 },
    { subject: "Puntualidad", A: 85, B: 90, fullMark: 150 },
    { subject: "Limpieza", A: 65, B: 85, fullMark: 150 },
  ];
}

export function getServicesByHourData() {
  return [
    { hour: "8-9", corte: 4, manicura: 2, facial: 1, masaje: 0 },
    { hour: "9-10", corte: 6, manicura: 3, facial: 2, masaje: 1 },
    { hour: "10-11", corte: 8, manicura: 5, facial: 3, masaje: 2 },
    { hour: "11-12", corte: 10, manicura: 7, facial: 4, masaje: 3 },
    { hour: "12-13", corte: 12, manicura: 8, facial: 5, masaje: 4 },
    { hour: "13-14", corte: 8, manicura: 6, facial: 3, masaje: 2 },
    { hour: "14-15", corte: 6, manicura: 4, facial: 2, masaje: 1 },
    { hour: "15-16", corte: 9, manicura: 5, facial: 3, masaje: 2 },
    { hour: "16-17", corte: 11, manicura: 7, facial: 4, masaje: 3 },
    { hour: "17-18", corte: 13, manicura: 9, facial: 5, masaje: 4 },
    { hour: "18-19", corte: 10, manicura: 6, facial: 3, masaje: 2 },
    { hour: "19-20", corte: 7, manicura: 4, facial: 2, masaje: 1 },
  ];
}

// Datos para las tarjetas de resumen
export function getClientSummaryData() {
  return {
    total: 245,
    growthPercent: 15.6,
    retentionRate: 92.4,
    retentionGrowth: 2.1,
    avgValue: 145,
    avgValueGrowth: 8.3,
  };
}

export function getAppointmentSummaryData() {
  return {
    total: 438,
    growthPercent: 8.2,
    attendanceRate: 89.5,
    attendanceGrowth: 1.3,
    avgDuration: 65,
    durationChange: -2.1,
  };
}

export function getCancellationTrendData() {
  return [
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
  ];
}
