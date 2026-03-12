// Tipos para los datos del dashboard

// Tipos para métricas generales
export interface MetricData {
  name: string;
  citas: number;
  ingresos: number;
  clientes: number;
}

// Tipos para datos de ingresos
export interface RevenueData {
  name: string;
  ingresos: number;
  gastos: number;
  beneficio: number;
}

// Tipos para datos de alumnos
export interface ClientGrowthData {
  month: string;
  nuevos: number;
  perdidos: number;
  total: number;
}

export interface ClientSegmentData {
  name: string;
  value: number;
  color: string;
}

export interface ClientRetentionData {
  month: string;
  tasa: number;
}

export interface ClientSatisfactionData {
  aspect: string;
  valor: number;
  fullMark: number;
}

// Tipos para datos de citas
export interface AppointmentByDayData {
  day: string;
  citas: number;
}

export interface AppointmentByHourData {
  hour: string;
  citas: number;
}

export interface AppointmentByServiceData {
  name: string;
  value: number;
  color: string;
}

export interface AppointmentStatusData {
  name: string;
  value: number;
  color: string;
}

export interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

export interface PopularServiceData {
  service: string;
  appointments: number;
  growth: string;
}

// Tipos para datos de servicios
export interface ServiceRevenueData {
  name: string;
  value: number;
  color: string;
}

// Tipos para datos de tendencias
export interface RevenueTrendData {
  month: string;
  actual: number;
  previo: number;
  objetivo: number;
}
