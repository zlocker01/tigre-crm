import useSWR from "swr";
import type { ClassSession } from "@/interfaces/appointments/Appointment";
import type { Client } from "@/interfaces/client/Client";
import type { Service } from "@/interfaces/services/Service";

interface CalendarData {
  appointments: ClassSession[];
  clients: Client[];
  services: Service[];
}

const fetchCalendarData = async ([_, landingPageId]: [
  string,
  string,
]): Promise<CalendarData> => {
  try {
    const [appointmentsResponse, clientsResponse, servicesResponse] =
      await Promise.all([
        fetch(`/api/appointments`).then((res) => res.json()),
        fetch(`/api/clients`).then((res) => res.json()),
        fetch(`/api/services?landingPageId=${landingPageId}`).then((res) =>
          res.json(),
        ),
      ]);

    const appointments = Array.isArray(appointmentsResponse?.data)
      ? appointmentsResponse.data
      : [];

    const clients = Array.isArray(clientsResponse?.clients)
      ? clientsResponse.clients
      : [];

    const services = Array.isArray(servicesResponse?.services)
      ? servicesResponse.services
      : [];

    return {
      appointments,
      clients,
      services,
    };
  } catch (error) {
    console.error("[useCalendarData] Error:", error);
    return {
      appointments: [],
      clients: [],
      services: [],
    };
  }
};

export const useCalendarData = (landingPageId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["calendar-data", landingPageId],
    fetchCalendarData,
  );

  return {
    appointments: data?.appointments || [],
    clients: data?.clients || [],
    services: data?.services || [],
    isLoading,
    error: error?.message || null,
    mutate,
  };
};
