export interface ClassSession {
  id: string;
  client_id?: string;
  service_id?: number;
  user_id: string;
  series_id?: string | null;
  start_datetime: string;
  end_datetime: string;
  status: 'Confirmada' | 'Cancelada' | 'Proceso';
  date: string;
  actual_duration_minutes?: number;
  price_charged: number | null;
  created_at: string;
}

export type Appointment = ClassSession;
