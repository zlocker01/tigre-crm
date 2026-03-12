export const dynamic = 'force-dynamic';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar, Users } from 'lucide-react';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { MetricsOverviewChart } from '@/components/dashboard/metrics-overview-chart';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { ServiceRevenueChart } from '@/components/dashboard/service-revenue-chart';
import { ClientsOverviewChart } from '@/components/dashboard/clients-overview-chart';
import { AppointmentsAnalysis } from '@/components/dashboard/appointments-analysis';
import { RecentAppointments } from '@/components/dashboard/recent-appointments';
import { InfoDialog } from '@/components/navegation/InfoDialog';

import { getAppointments } from '@/data/appointments/getAppointments';
import { getClients } from '@/data/clients/getClients';
import { createClient } from '@/utils/supabase/server';

import type { Appointment } from '@/interfaces/appointments/Appointment';
import type { Client } from '@/interfaces/client/Client';
import type { Service } from '@/interfaces/services/Service';
import type {
  MetricData,
  RevenueData,
  ClientSegmentData,
  ServiceRevenueData,
  AppointmentByDayData,
  AppointmentByHourData,
  AppointmentByServiceData,
  AppointmentStatusData,
  HeatmapData,
  PopularServiceData,
} from '@/interfaces/dashboard';

function monthLabel(d: Date) {
  return d.toLocaleString('es-ES', { month: 'short' }).replace('.', '');
}

function dayLabel(d: Date) {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return days[d.getDay()];
}

function groupByMonth(appointments: Appointment[]): MetricData[] {
  const map = new Map<
    string,
    { citas: number; ingresos: number; clientes: Set<string> }
  >();
  appointments.forEach((a) => {
    const d = new Date(a.start_datetime);
    const key = monthLabel(d);
    const entry = map.get(key) || {
      citas: 0,
      ingresos: 0,
      clientes: new Set<string>(),
    };
    entry.citas += 1;
    entry.ingresos += a.price_charged || 0;
    if (a.client_id) entry.clientes.add(a.client_id);
    map.set(key, entry);
  });

  // Orden mensual aproximado: Ene..Dic según aparición; mejor orden fijo es complejo sin año, mantenemos según Intl order
  const order = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ];
  return Array.from(map.entries())
    .sort(
      (a, b) =>
        order.indexOf(a[0].toLowerCase()) - order.indexOf(b[0].toLowerCase()),
    )
    .map(([name, v]) => ({
      name,
      citas: v.citas,
      ingresos: v.ingresos,
      clientes: v.clientes.size,
    }));
}

function computeRevenueSeriesMonthly(
  appointments: Appointment[],
): RevenueData[] {
  const byMonth = new Map<string, number>();
  appointments.forEach((a) => {
    const d = new Date(a.start_datetime);
    const key = monthLabel(d);
    byMonth.set(key, (byMonth.get(key) || 0) + (a.price_charged || 0));
  });
  const order = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ];
  return Array.from(byMonth.entries())
    .sort(
      (a, b) =>
        order.indexOf(a[0].toLowerCase()) - order.indexOf(b[0].toLowerCase()),
    )
    .map(([name, ingresos]) => ({
      name,
      ingresos,
      gastos: 0,
      beneficio: ingresos,
    }));
}

function computeRevenueSeriesWeekly(
  appointments: Appointment[],
): RevenueData[] {
  // últimos 7 días por día de semana
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  const byDay = new Map<string, number>();
  appointments.forEach((a) => {
    const d = new Date(a.start_datetime);
    if (d >= sevenDaysAgo && d <= now) {
      const key = dayLabel(d);
      byDay.set(key, (byDay.get(key) || 0) + (a.price_charged || 0));
    }
  });
  const order = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  return Array.from(byDay.entries())
    .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    .map(([name, ingresos]) => ({
      name,
      ingresos,
      gastos: 0,
      beneficio: ingresos,
    }));
}

// Paleta cualitativa amplia y de alto contraste (inspirada en Paul Tol / Tableau)
const QUAL_PALETTE = [
  '#332288',
  '#88CCEE',
  '#44AA99',
  '#117733',
  '#999933',
  '#DDCC77',
  '#CC6677',
  '#882255',
  '#AA4499',
  '#6699CC',
  '#AA4466',
  '#4477AA',
  '#66CCEE',
  '#228833',
  '#CCBB44',
  '#EE6677',
  '#AA3377',
  '#BBBBBB',
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
];

function hashStringToInt(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function distinctColorForKey(key: string, idx: number): string {
  // 1) Determinista por nombre usando paleta amplia
  const h = hashStringToInt(key);
  const paletteColor = QUAL_PALETTE[h % QUAL_PALETTE.length];
  if (paletteColor) return paletteColor;
  // 2) Fallback: HSL con ángulo dorado y alternancia de luminosidad para mayor contraste
  const golden = 137.508;
  const hue = (idx * golden) % 360;
  const lightness = idx % 2 === 0 ? 45 : 60; // alterna 45%/60%
  const saturation = 70;
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function computeServiceRevenue(
  appointments: Appointment[],
  services: { id: number; title: string }[],
): ServiceRevenueData[] {
  const titleById = new Map<number, string>();
  services.forEach((s) => titleById.set(s.id, s.title));
  const byService = new Map<string, number>();
  appointments.forEach((a) => {
    if (!a.service_id) return;
    const name =
      titleById.get(Number(a.service_id)) || `Servicio ${a.service_id}`;
    byService.set(name, (byService.get(name) || 0) + (a.price_charged || 0));
  });
  return Array.from(byService.entries()).map(([name, value], idx) => ({
    name,
    value,
    color: distinctColorForKey(name, idx),
  }));
}

function computeClientsOverview(
  appointments: Appointment[],
  clients: Client[],
): ClientSegmentData[] {
  const now = new Date();
  const ninety = new Date(now);
  ninety.setDate(now.getDate() - 90);
  const oneEighty = new Date(now);
  oneEighty.setDate(now.getDate() - 180);
  const firstAppt = new Map<string, Date>();
  const recentCount = new Map<string, number>();
  appointments.forEach((a) => {
    if (!a.client_id) return;
    const d = new Date(a.start_datetime);
    const clientId = a.client_id;
    const fa = firstAppt.get(clientId);
    if (!fa || d < fa) firstAppt.set(clientId, d);
    if (d >= oneEighty) {
      recentCount.set(clientId, (recentCount.get(clientId) || 0) + 1);
    }
  });

  let nuevos = 0,
    recurrentes = 0,
    inactivos = 0;
  clients.forEach((c) => {
    const fa = firstAppt.get(c.id);
    const rc = recentCount.get(c.id) || 0;
    if (fa && fa >= ninety) {
      nuevos += 1;
    } else if (rc > 0) {
      // tuvo actividad en últimos 180 días
      recurrentes += 1;
    } else {
      inactivos += 1;
    }
  });

  return [
    { name: 'Nuevos', value: nuevos, color: '#8884d8' },
    { name: 'Recurrentes', value: recurrentes, color: '#82ca9d' },
    { name: 'Inactivos', value: inactivos, color: '#ffc658' },
  ];
}

function computeClientSummary(appointments: Appointment[], clients: Client[]) {
  const now = new Date();
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const newThisMonth = new Set<string>();
  const newPrevMonth = new Set<string>();
  const firstAppt = new Map<string, Date>();
  appointments.forEach((a) => {
    if (!a.client_id) return;
    const d = new Date(a.start_datetime);
    const clientId = a.client_id;
    const fa = firstAppt.get(clientId);
    if (!fa || d < fa) firstAppt.set(clientId, d);
  });
  firstAppt.forEach((d, clientId) => {
    if (d >= startThisMonth) newThisMonth.add(clientId);
    else if (d >= startPrevMonth && d <= endPrevMonth)
      newPrevMonth.add(clientId);
  });

  const growthPercent =
    newPrevMonth.size === 0
      ? 100
      : Number(
          (
            ((newThisMonth.size - newPrevMonth.size) /
              Math.max(1, newPrevMonth.size)) *
            100
          ).toFixed(1),
        );

  // Retención: clientes con cita en mes actual que también tuvieron en el mes anterior
  const hadThisMonth = new Set<string>();
  const hadPrevMonth = new Set<string>();
  appointments.forEach((a) => {
    if (!a.client_id) return;
    const d = new Date(a.start_datetime);
    const clientId = a.client_id;
    if (d >= startThisMonth) hadThisMonth.add(clientId);
    else if (d >= startPrevMonth && d <= endPrevMonth)
      hadPrevMonth.add(clientId);
  });
  const retained = Array.from(hadThisMonth).filter((id) =>
    hadPrevMonth.has(id),
  ).length;
  const retentionRate =
    hadThisMonth.size === 0
      ? 0
      : Number(((retained / hadThisMonth.size) * 100).toFixed(1));

  // Valor promedio cliente: ingreso total / clientes activos mes actual
  let ingresosMes = 0;
  appointments.forEach((a) => {
    const d = new Date(a.start_datetime);
    if (d >= startThisMonth) ingresosMes += a.price_charged || 0;
  });
  const avgValue =
    hadThisMonth.size === 0 ? 0 : Math.round(ingresosMes / hadThisMonth.size);

  return {
    total: clients.length,
    growthPercent,
    retentionRate,
    retentionGrowth: 0,
    avgValue,
    avgValueGrowth: 0,
  };
}

function computeAppointmentSummary(appointments: Appointment[]) {
  const now = new Date();
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const totalThisMonth = appointments.filter(
    (a) => new Date(a.start_datetime) >= startThisMonth,
  ).length;
  const totalPrevMonth = appointments.filter((a) => {
    const d = new Date(a.start_datetime);
    return d >= startPrevMonth && d <= endPrevMonth;
  }).length;
  const growthPercent =
    totalPrevMonth === 0
      ? 100
      : Number(
          (
            ((totalThisMonth - totalPrevMonth) / Math.max(1, totalPrevMonth)) *
            100
          ).toFixed(1),
        );

  const monthAppointments = appointments.filter(
    (a) => new Date(a.start_datetime) >= startThisMonth,
  );
  const attended = monthAppointments.filter(
    (a) => a.status === 'Confirmada',
  ).length;
  const attendanceRate =
    monthAppointments.length === 0
      ? 0
      : Number(((attended / monthAppointments.length) * 100).toFixed(1));

  return {
    total: appointments.length,
    growthPercent,
    attendanceRate,
    attendanceGrowth: 0,
  };
}

// ---- Datasets para AppointmentsAnalysis ----
function computeAppointmentsByDayData(
  appts: Appointment[],
): AppointmentByDayData[] {
  const labels = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  const counts = new Map<string, number>(labels.map((l) => [l, 0] as const));
  appts.forEach((a) => {
    const d = new Date(a.start_datetime);
    const idx = (d.getDay() + 6) % 7; // 0=Dom -> 6
    const key = labels[idx];
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return labels.map((day) => ({ day, citas: counts.get(day) || 0 }));
}

function computeAppointmentsByHourData(
  appts: Appointment[],
): AppointmentByHourData[] {
  const hours = Array.from({ length: 12 }, (_, i) => 8 + i); // 8..19
  const labels = hours.map((h) => `${h}-${h + 1}`);
  const counts = new Map<string, number>(labels.map((l) => [l, 0] as const));
  appts.forEach((a) => {
    const d = new Date(a.start_datetime);
    const h = d.getHours();
    if (h >= 8 && h < 20) {
      const key = `${h}-${h + 1}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  });
  return labels.map((hour) => ({ hour, citas: counts.get(hour) || 0 }));
}

function computeAppointmentsByServiceData(
  appts: Appointment[],
  services: Service[],
): AppointmentByServiceData[] {
  const byService = new Map<number, number>();
  appts.forEach((a) => {
    if (a.service_id) {
      const id = Number(a.service_id);
      byService.set(id, (byService.get(id) || 0) + 1);
    }
  });
  const colorPool = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff8042',
    '#0088fe',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
  ];
  return Array.from(byService.entries()).map(([id, value], idx) => {
    const svc = services.find((s) => Number(s.id) === id);
    return {
      name: svc?.title || `Servicio ${id}`,
      value,
      color: colorPool[idx % colorPool.length],
    };
  });
}

function computeAppointmentStatusData(
  appts: Appointment[],
): AppointmentStatusData[] {
  const keys = ['Confirmada', 'Cancelada', 'Proceso'] as const;
  const colors: Record<(typeof keys)[number], string> = {
    Confirmada: '#4CAF50',
    Cancelada: '#F44336',
    Proceso: '#FF9800',
  };
  const counts: Record<(typeof keys)[number], number> = {
    Confirmada: 0,
    Cancelada: 0,
    Proceso: 0,
  };
  appts.forEach((a) => {
    counts[a.status] += 1;
  });
  return keys.map((k) => ({
    name:
      k === 'Proceso'
        ? 'En proceso'
        : k === 'Confirmada'
          ? 'Completadas'
          : 'Canceladas',
    value: counts[k],
    color: colors[k],
  }));
}

function computeHeatmapData(appts: Appointment[]): HeatmapData[] {
  const dayLabels = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  const hourRanges = ['8-10', '10-12', '12-14', '14-16', '16-18', '18-20'];
  const map = new Map<string, number>();
  function bucket(h: number) {
    if (h < 10) return '8-10';
    if (h < 12) return '10-12';
    if (h < 14) return '12-14';
    if (h < 16) return '14-16';
    if (h < 18) return '16-18';
    return '18-20';
  }
  appts.forEach((a) => {
    const d = new Date(a.start_datetime);
    const idx = (d.getDay() + 6) % 7; // Lunes=0
    const day = dayLabels[idx];
    const y = bucket(d.getHours());
    const key = `${day}|${y}`;
    map.set(key, (map.get(key) || 0) + 1);
  });
  const data: HeatmapData[] = [];
  dayLabels.forEach((x) =>
    hourRanges.forEach((y) =>
      data.push({ x, y, value: map.get(`${x}|${y}`) || 0 }),
    ),
  );
  return data;
}

function computePopularServicesData(
  appts: Appointment[],
  services: Service[],
): PopularServiceData[] {
  const now = new Date();
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Filtrar citas por mes actual y mes anterior
  const thisMonthAppts = appts.filter(
    (a) => new Date(a.start_datetime) >= startThisMonth,
  );
  const prevMonthAppts = appts.filter((a) => {
    const d = new Date(a.start_datetime);
    return d >= startPrevMonth && d <= endPrevMonth;
  });

  // Contar citas por servicio para el mes actual
  const countsThisMonth = new Map<number, number>();
  thisMonthAppts.forEach((a) => {
    if (a.service_id) {
      const id = Number(a.service_id);
      countsThisMonth.set(id, (countsThisMonth.get(id) || 0) + 1);
    }
  });

  // Contar citas por servicio para el mes anterior
  const countsPrevMonth = new Map<number, number>();
  prevMonthAppts.forEach((a) => {
    if (a.service_id) {
      const id = Number(a.service_id);
      countsPrevMonth.set(id, (countsPrevMonth.get(id) || 0) + 1);
    }
  });

  // Calcular crecimiento y crear objetos de datos
  const items: PopularServiceData[] = Array.from(countsThisMonth.entries()).map(
    ([id, count]) => {
      const svc = services.find((s) => Number(s.id) === id);
      const prevCount = countsPrevMonth.get(id) || 0;

      // Calcular porcentaje de crecimiento
      let growthPercent = 0;
      if (prevCount === 0) {
        growthPercent = 100; // Nuevo servicio (100% de crecimiento)
      } else {
        growthPercent = Number(
          (((count - prevCount) / prevCount) * 100).toFixed(1),
        );
      }

      // Formatear el crecimiento con signo
      const growthFormatted =
        growthPercent > 0 ? `+${growthPercent}%` : `${growthPercent}%`;

      return {
        service: svc?.title || `Servicio ${id}`,
        appointments: count,
        growth: growthFormatted,
      };
    },
  );

  // Ordenar por número de citas y tomar los 5 más populares
  return items.sort((a, b) => b.appointments - a.appointments).slice(0, 5);
}

function computeCancellationTrendData(
  appts: Appointment[],
): { month: string; tasa: number }[] {
  // últimos 12 meses
  const now = new Date();
  const months: string[] = [];
  const data: { month: string; tasa: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = monthLabel(d).replace('.', '');
    months.push(label);
  }
  months.forEach((m, idx) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (11 - idx), 1);
    const end = new Date(
      now.getFullYear(),
      now.getMonth() - (11 - idx) + 1,
      0,
      23,
      59,
      59,
      999,
    );
    const slice = appts.filter((a) => {
      const d = new Date(a.start_datetime);
      return d >= start && d <= end;
    });
    const canceled = slice.filter((a) => a.status === 'Cancelada').length;
    const tasa =
      slice.length === 0
        ? 0
        : Number(((canceled / slice.length) * 100).toFixed(0));
    data.push({ month: m, tasa });
  });
  return data;
}

// ---- Helpers de filtrado por rango temporal ----
type TimeRange = 'week' | 'month' | 'quarter' | 'year';

function getRangeStart(range: TimeRange, ref = new Date()): Date {
  const d = new Date(ref);
  switch (range) {
    case 'week': {
      const start = new Date(d);
      start.setDate(d.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    case 'month': {
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    case 'quarter': {
      const q = Math.floor(d.getMonth() / 3);
      const qm = q * 3; // 0,3,6,9
      return new Date(d.getFullYear(), qm, 1);
    }
    case 'year':
    default: {
      return new Date(d.getFullYear(), 0, 1);
    }
  }
}

function filterAppointmentsByRange(
  appts: Appointment[],
  range: TimeRange,
): Appointment[] {
  const start = getRangeStart(range);
  const end = new Date();
  return appts.filter((a) => {
    const d = new Date(a.start_datetime);
    return d >= start && d <= end;
  });
}

export default async function DashboardPage() {
  // Cargar datos reales
  const [appointments = [], clients = []] = await Promise.all([
    getAppointments(),
    getClients(),
  ]);

  const supabase = await createClient();
  const { data: services } = await supabase
    .from('services')
    .select('id, title');

  // Construir datasets
  const metricsData: MetricData[] = groupByMonth(appointments);
  const monthlyRevenueData: RevenueData[] =
    computeRevenueSeriesMonthly(appointments);
  const weeklyRevenueData: RevenueData[] =
    computeRevenueSeriesWeekly(appointments);
  const hasRevenueData =
    monthlyRevenueData.length > 0 || weeklyRevenueData.length > 0;
  const serviceRevenueData: ServiceRevenueData[] = computeServiceRevenue(
    appointments,
    (services as any) || [],
  );
  const clientOverviewData: ClientSegmentData[] = computeClientsOverview(
    appointments,
    clients as Client[],
  );
  const clientSummary = computeClientSummary(appointments, clients as Client[]);
  const appointmentSummary = computeAppointmentSummary(appointments);

  // Citas recientes con datos enriquecidos
  const clientById = new Map<string, Client>();
  (clients as Client[]).forEach((c) => clientById.set(c.id, c));
  const serviceById = new Map<number, Service>();
  ((services as Service[]) || []).forEach((s) =>
    serviceById.set(Number(s.id), s as Service),
  );
  const recentAppointments = [...(appointments as Appointment[])]
    .sort(
      (a, b) =>
        new Date(b.start_datetime).getTime() -
        new Date(a.start_datetime).getTime(),
    )
    .slice(0, 5)
    .map((a) => {
      const clientId = a.client_id ?? 'unknown-client';
      const client = a.client_id ? clientById.get(a.client_id) : undefined;
      return {
        id: a.id,
        user_id: a.user_id,
        start_datetime: a.start_datetime,
        end_datetime: a.end_datetime,
        status: a.status,
        date: a.date,
        price_charged: a.price_charged,
        created_at: a.created_at,
        client: {
          id: clientId,
          name: client?.name || 'Cliente',
          avatar: client?.avatar || '/app/avatar.png',
        },
        service: {
          id: Number(a.service_id || 0),
          title:
            (a.service_id && serviceById.get(Number(a.service_id))?.title) ||
            'Servicio',
        },
      };
    });

  // Datasets para análisis detallado
  const appointmentsByDayData = computeAppointmentsByDayData(appointments);
  const appointmentsByHourData = computeAppointmentsByHourData(appointments);
  const appointmentsByServiceData = computeAppointmentsByServiceData(
    appointments,
    (services as Service[]) || [],
  );
  const appointmentStatusData = computeAppointmentStatusData(appointments);
  const heatmapData = computeHeatmapData(appointments);
  const popularServicesData = computePopularServicesData(
    appointments,
    (services as Service[]) || [],
  );
  const cancellationTrendData = computeCancellationTrendData(appointments);

  // Datasets por rango temporal para análisis de citas
  const ranges: TimeRange[] = ['week', 'month', 'quarter', 'year'];
  const datasetsByRange = Object.fromEntries(
    ranges.map((r) => {
      const appts = filterAppointmentsByRange(appointments as Appointment[], r);
      const byDay: AppointmentByDayData[] = computeAppointmentsByDayData(appts);
      const byHour: AppointmentByHourData[] =
        computeAppointmentsByHourData(appts);
      const byService: AppointmentByServiceData[] =
        computeAppointmentsByServiceData(appts, (services as Service[]) || []);
      const statusData: AppointmentStatusData[] =
        computeAppointmentStatusData(appts);
      const heatmap: HeatmapData[] = computeHeatmapData(appts);
      const popular: PopularServiceData[] = computePopularServicesData(
        appts,
        (services as Service[]) || [],
      );
      const summary = computeAppointmentSummary(appts);
      // Para la tendencia de cancelaciones, podemos mantener últimos 12 meses, independiente del rango
      const cancelTrend = computeCancellationTrendData(appointments);
      return [
        r,
        {
          appointmentsByDayData: byDay,
          appointmentsByHourData: byHour,
          appointmentsByServiceData: byService,
          appointmentStatusData: statusData,
          heatmapData: heatmap,
          popularServicesData: popular,
          appointmentSummary: summary,
          cancellationTrendData: cancelTrend,
        },
      ];
    }),
  ) as Record<
    TimeRange,
    {
      appointmentsByDayData: AppointmentByDayData[];
      appointmentsByHourData: AppointmentByHourData[];
      appointmentsByServiceData: AppointmentByServiceData[];
      appointmentStatusData: AppointmentStatusData[];
      heatmapData: HeatmapData[];
      popularServicesData: PopularServiceData[];
      appointmentSummary: ReturnType<typeof computeAppointmentSummary>;
      cancellationTrendData: ReturnType<typeof computeCancellationTrendData>;
    }
  >;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Vista general de métricas y análisis del negocio.
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Resumen rápido</h2>
        <InfoDialog description="Resumen rápido de la academia: cuántos alumnos tienes, cuántos regresan a entrenar y cuánto ingreso promedio genera cada alumno.">
          Resumen rápido
        </InfoDialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Clientes Totales"
          value={clientSummary.total}
          changePercent={clientSummary.growthPercent}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <SummaryCard
          title="Tasa de Retención"
          value={`${clientSummary.retentionRate}%`}
          changePercent={clientSummary.retentionGrowth}
        />
        <SummaryCard
          title="Valor Promedio Cliente"
          value={`$${clientSummary.avgValue}`}
          changePercent={clientSummary.avgValueGrowth}
        />
        <SummaryCard
          title="Citas Totales"
          value={appointmentSummary.total}
          changePercent={appointmentSummary.growthPercent}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold">Métricas Generales</h3>
            <InfoDialog description="Aquí ves, mes a mes, la actividad de la academia: reservas/clases, ingresos y alumnos activos para comparar meses fuertes y meses más tranquilos.">
              Métricas generales
            </InfoDialog>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Resumen de citas, clientes e ingresos
          </p>
          <MetricsOverviewChart data={metricsData} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>Ingresos</CardTitle>
                <CardDescription>Comparativa mensual y semanal</CardDescription>
              </div>
              <InfoDialog description="Muestra cuánto dinero entra a la academia por semana y por mes (mensualidades, inscripciones, seminarios, ventas), para ver tendencias y temporadas.">
                Ingresos
              </InfoDialog>
            </div>
          </CardHeader>
          <CardContent>
            {hasRevenueData ? (
              <RevenueChart
                monthlyData={monthlyRevenueData}
                weeklyData={weeklyRevenueData}
              />
            ) : (
              <RevenueChart />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>Ingresos por Servicio</CardTitle>
                <CardDescription>
                  Distribución de ingresos por tipo de servicio
                </CardDescription>
              </div>
              <InfoDialog description="Te muestra qué servicios dejan más ingresos (clases, inscripciones, seminarios o productos) para decidir qué impulsar y qué ajustar.">
                Ingresos por servicio
              </InfoDialog>
            </div>
          </CardHeader>
          <CardContent>
            <ServiceRevenueChart data={serviceRevenueData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>Resumen de Clientes</CardTitle>
                <CardDescription>
                  Distribución de clientes por categoría
                </CardDescription>
              </div>
              <InfoDialog description="Segmenta a tus alumnos en nuevos, recurrentes e inactivos para identificar retención y quién necesita seguimiento para volver a entrenar.">
                Resumen de clientes
              </InfoDialog>
            </div>
          </CardHeader>
          <CardContent>
            <ClientsOverviewChart data={clientOverviewData} isLoading={false} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>Citas Recientes</CardTitle>
              <CardDescription>Últimas citas registradas</CardDescription>
            </div>
            <InfoDialog description="Muestra las últimas reservas/agendas para que veas rápido qué entrenamientos vienen y si hubo cambios como cancelaciones o confirmaciones.">
              Citas recientes
            </InfoDialog>
          </div>
        </CardHeader>
        <CardContent>
          <RecentAppointments appointments={recentAppointments as any} />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Análisis detallado de citas</h2>
        <InfoDialog description="Aquí tienes gráficas más completas sobre la agenda: días y horarios con más demanda, servicios/clases más reservados y filtros de tiempo para analizar distintos periodos.">
          Análisis de citas
        </InfoDialog>
      </div>
      <AppointmentsAnalysis
        appointmentsByDayData={appointmentsByDayData}
        appointmentsByHourData={appointmentsByHourData}
        appointmentsByServiceData={appointmentsByServiceData}
        appointmentStatusData={appointmentStatusData}
        heatmapData={heatmapData}
        popularServicesData={popularServicesData}
        appointmentSummary={appointmentSummary}
        cancellationTrendData={cancellationTrendData}
        datasetsByRange={datasetsByRange}
      />
    </div>
  );
}
