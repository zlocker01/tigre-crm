-- Normalize RPC functions so a fresh clone matches the current app schema.

DROP FUNCTION IF EXISTS public.get_service_revenue_data();
CREATE FUNCTION public.get_service_revenue_data()
RETURNS TABLE(name text, value numeric)
LANGUAGE sql
AS $$
  SELECT
    s.title AS name,
    COALESCE(SUM(COALESCE(cs.price_charged, s.price, 0)), 0)::numeric AS value
  FROM public.class_sessions cs
  JOIN public.services s ON s.id = cs.service_id
  WHERE cs.status = 'Confirmada'
  GROUP BY s.title
  ORDER BY value DESC
  LIMIT 10;
$$;

DROP FUNCTION IF EXISTS public.get_appointments_by_day();
CREATE FUNCTION public.get_appointments_by_day()
RETURNS TABLE(day_number integer, day text, citas bigint)
LANGUAGE sql
AS $$
  SELECT
    EXTRACT(DOW FROM cs.start_datetime)::integer AS day_number,
    CASE EXTRACT(DOW FROM cs.start_datetime)::integer
      WHEN 0 THEN 'Domingo'
      WHEN 1 THEN 'Lunes'
      WHEN 2 THEN 'Martes'
      WHEN 3 THEN 'Miercoles'
      WHEN 4 THEN 'Jueves'
      WHEN 5 THEN 'Viernes'
      WHEN 6 THEN 'Sabado'
    END AS day,
    COUNT(*)::bigint AS citas
  FROM public.class_sessions cs
  GROUP BY 1, 2
  ORDER BY 1;
$$;

DROP FUNCTION IF EXISTS public.get_appointments_by_service();
CREATE FUNCTION public.get_appointments_by_service()
RETURNS TABLE(name text, value bigint)
LANGUAGE sql
AS $$
  SELECT
    s.title AS name,
    COUNT(cs.id)::bigint AS value
  FROM public.class_sessions cs
  JOIN public.services s ON s.id = cs.service_id
  GROUP BY s.title
  ORDER BY value DESC
  LIMIT 10;
$$;

DROP FUNCTION IF EXISTS public.get_client_sources();
CREATE FUNCTION public.get_client_sources()
RETURNS TABLE(name text, value bigint)
LANGUAGE sql
AS $$
  SELECT
    COALESCE(NULLIF(c.client_source, ''), 'desconocido') AS name,
    COUNT(*)::bigint AS value
  FROM public.clients c
  GROUP BY 1
  ORDER BY value DESC;
$$;

DROP FUNCTION IF EXISTS public.get_appointment_status_data();
CREATE FUNCTION public.get_appointment_status_data()
RETURNS TABLE(status text, count bigint)
LANGUAGE sql
AS $$
  SELECT
    cs.status,
    COUNT(*)::bigint AS count
  FROM public.class_sessions cs
  WHERE cs.status IN ('Confirmada', 'Cancelada', 'Proceso')
  GROUP BY cs.status
  ORDER BY count DESC;
$$;

DROP FUNCTION IF EXISTS public.get_revenue_data(text);
CREATE FUNCTION public.get_revenue_data(time_range text DEFAULT 'monthly')
RETURNS TABLE(period text, revenue numeric, expenses numeric)
LANGUAGE plpgsql
AS $$
DECLARE
  current_date_ts timestamp := now();
  period_start timestamp;
  period_end timestamp;
  label text;
  income numeric;
  expense numeric;
  i integer;
BEGIN
  IF time_range = 'weekly' THEN
    FOR i IN 0..3 LOOP
      period_start := date_trunc('month', current_date_ts) + make_interval(days => i * 7);
      period_end := LEAST(
        date_trunc('month', current_date_ts) + make_interval(days => (i + 1) * 7),
        date_trunc('month', current_date_ts) + interval '1 month'
      );
      label := 'Sem ' || (i + 1);

      SELECT
        COALESCE(SUM(COALESCE(cs.price_charged, s.price, 0)), 0),
        COALESCE(SUM(COALESCE(cs.price_charged, s.price, 0) * 0.6), 0)
      INTO income, expense
      FROM public.class_sessions cs
      LEFT JOIN public.services s ON s.id = cs.service_id
      WHERE cs.status = 'Confirmada'
        AND cs.start_datetime >= period_start
        AND cs.start_datetime < period_end;

      period := label;
      revenue := income;
      expenses := expense;
      RETURN NEXT;
    END LOOP;
  ELSE
    FOR i IN 1..12 LOOP
      period_start := make_timestamp(EXTRACT(YEAR FROM current_date_ts)::integer, i, 1, 0, 0, 0);
      period_end := period_start + interval '1 month';
      label := to_char(period_start, 'Mon');
      label := INITCAP(translate(label, 'áéíóúÁÉÍÓÚ', 'aeiouAEIOU'));
      label := replace(label, '.', '');

      SELECT
        COALESCE(SUM(COALESCE(cs.price_charged, s.price, 0)), 0),
        COALESCE(SUM(COALESCE(cs.price_charged, s.price, 0) * 0.6), 0)
      INTO income, expense
      FROM public.class_sessions cs
      LEFT JOIN public.services s ON s.id = cs.service_id
      WHERE cs.status = 'Confirmada'
        AND cs.start_datetime >= period_start
        AND cs.start_datetime < period_end;

      period := label;
      revenue := income;
      expenses := expense;
      RETURN NEXT;
    END LOOP;
  END IF;
END;
$$;

DROP FUNCTION IF EXISTS public.get_client_growth_data();
CREATE FUNCTION public.get_client_growth_data()
RETURNS TABLE(month text, nuevos integer, perdidos integer, total integer)
LANGUAGE plpgsql
AS $$
DECLARE
  current_year integer := EXTRACT(YEAR FROM CURRENT_DATE);
  month_start date;
  month_end date;
  i integer;
  new_clients integer;
  lost_clients integer;
  total_clients integer;
BEGIN
  FOR i IN 1..12 LOOP
    month_start := make_date(current_year, i, 1);
    month_end := (month_start + interval '1 month')::date;

    SELECT COUNT(*)::integer
    INTO new_clients
    FROM public.clients c
    WHERE c.registration_date >= month_start
      AND c.registration_date < month_end;

    SELECT COUNT(*)::integer
    INTO lost_clients
    FROM public.clients c
    WHERE EXISTS (
      SELECT 1
      FROM public.class_sessions cs
      WHERE cs.client_id = c.id
        AND cs.start_datetime < month_start
    )
      AND NOT EXISTS (
        SELECT 1
        FROM public.class_sessions cs
        WHERE cs.client_id = c.id
          AND cs.start_datetime >= month_start - interval '90 days'
          AND cs.start_datetime < month_end
      );

    SELECT COUNT(*)::integer
    INTO total_clients
    FROM public.clients c
    WHERE c.registration_date < month_end;

    month := INITCAP(to_char(month_start, 'Mon'));
    month := replace(month, '.', '');
    nuevos := COALESCE(new_clients, 0);
    perdidos := COALESCE(lost_clients, 0);
    total := COALESCE(total_clients, 0);
    RETURN NEXT;
  END LOOP;
END;
$$;

DROP FUNCTION IF EXISTS public.get_client_segmentation_data();
CREATE FUNCTION public.get_client_segmentation_data()
RETURNS TABLE(name text, value integer, color text)
LANGUAGE plpgsql
AS $$
DECLARE
  current_cutoff timestamp := now() - interval '1 year';
  new_clients integer;
  occasional_clients integer;
  regular_clients integer;
  frequent_clients integer;
  vip_clients integer;
BEGIN
  SELECT COUNT(*)::integer
  INTO new_clients
  FROM public.clients c
  WHERE c.registration_date >= now() - interval '3 months';

  SELECT COUNT(*)::integer
  INTO occasional_clients
  FROM (
    SELECT cs.client_id
    FROM public.class_sessions cs
    WHERE cs.client_id IS NOT NULL
      AND cs.start_datetime >= current_cutoff
    GROUP BY cs.client_id
    HAVING COUNT(*) BETWEEN 1 AND 3
  ) grouped_clients;

  SELECT COUNT(*)::integer
  INTO regular_clients
  FROM (
    SELECT cs.client_id
    FROM public.class_sessions cs
    WHERE cs.client_id IS NOT NULL
      AND cs.start_datetime >= current_cutoff
    GROUP BY cs.client_id
    HAVING COUNT(*) BETWEEN 4 AND 8
  ) grouped_clients;

  SELECT COUNT(*)::integer
  INTO frequent_clients
  FROM (
    SELECT cs.client_id
    FROM public.class_sessions cs
    WHERE cs.client_id IS NOT NULL
      AND cs.start_datetime >= current_cutoff
    GROUP BY cs.client_id
    HAVING COUNT(*) >= 9
  ) grouped_clients;

  WITH spending AS (
    SELECT
      cs.client_id,
      SUM(COALESCE(cs.price_charged, s.price, 0)) AS total_spent
    FROM public.class_sessions cs
    LEFT JOIN public.services s ON s.id = cs.service_id
    WHERE cs.client_id IS NOT NULL
      AND cs.start_datetime >= current_cutoff
      AND cs.status = 'Confirmada'
    GROUP BY cs.client_id
  ),
  ranked AS (
    SELECT
      client_id,
      ROW_NUMBER() OVER (ORDER BY total_spent DESC NULLS LAST) AS rank_position,
      COUNT(*) OVER () AS total_clients
    FROM spending
  )
  SELECT COUNT(*)::integer
  INTO vip_clients
  FROM ranked
  WHERE rank_position <= GREATEST(1, CEIL(total_clients * 0.1));

  name := 'Nuevos (0-3 meses)'; value := COALESCE(new_clients, 0); color := '#8884d8'; RETURN NEXT;
  name := 'Ocasionales (1-3 visitas/anio)'; value := COALESCE(occasional_clients, 0); color := '#82ca9d'; RETURN NEXT;
  name := 'Regulares (4-8 visitas/anio)'; value := COALESCE(regular_clients, 0); color := '#ffc658'; RETURN NEXT;
  name := 'Frecuentes (9+ visitas/anio)'; value := COALESCE(frequent_clients, 0); color := '#ff8042'; RETURN NEXT;
  name := 'VIP (Top 10% en gasto)'; value := COALESCE(vip_clients, 0); color := '#0088fe'; RETURN NEXT;
END;
$$;

DROP FUNCTION IF EXISTS public.get_client_retention_data();
CREATE FUNCTION public.get_client_retention_data()
RETURNS TABLE(month text, tasa integer)
LANGUAGE plpgsql
AS $$
DECLARE
  current_year integer := EXTRACT(YEAR FROM CURRENT_DATE);
  month_start date;
  month_end date;
  i integer;
  total_clients integer;
  returning_clients integer;
BEGIN
  FOR i IN 1..12 LOOP
    month_start := make_date(current_year, i, 1);
    month_end := (month_start + interval '1 month')::date;

    SELECT COUNT(DISTINCT cs.client_id)::integer
    INTO total_clients
    FROM public.class_sessions cs
    WHERE cs.client_id IS NOT NULL
      AND cs.start_datetime >= month_start
      AND cs.start_datetime < month_end;

    WITH ordered_sessions AS (
      SELECT
        cs.client_id,
        cs.start_datetime,
        LEAD(cs.start_datetime) OVER (
          PARTITION BY cs.client_id
          ORDER BY cs.start_datetime
        ) AS next_start_datetime
      FROM public.class_sessions cs
      WHERE cs.client_id IS NOT NULL
        AND EXTRACT(YEAR FROM cs.start_datetime) = current_year
    )
    SELECT COUNT(DISTINCT client_id)::integer
    INTO returning_clients
    FROM ordered_sessions os
    WHERE os.start_datetime >= month_start
      AND os.start_datetime < month_end
      AND os.next_start_datetime IS NOT NULL
      AND os.next_start_datetime <= os.start_datetime + interval '30 days';

    month := INITCAP(replace(to_char(month_start, 'Mon'), '.', ''));
    tasa := CASE
      WHEN COALESCE(total_clients, 0) = 0 THEN 0
      ELSE ROUND((COALESCE(returning_clients, 0)::numeric * 100) / total_clients)::integer
    END;
    RETURN NEXT;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_service_revenue_data() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_appointments_by_day() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_appointments_by_service() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_client_sources() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_appointment_status_data() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_revenue_data(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_client_growth_data() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_client_segmentation_data() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_client_retention_data() TO anon, authenticated, service_role;
