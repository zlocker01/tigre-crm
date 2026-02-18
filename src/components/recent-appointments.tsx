import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const appointments = [
  {
    id: "1",
    client: {
      name: "María García",
      email: "maria@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    service: "Clase Principiantes",
    date: "2023-03-15T10:00:00",
    status: "confirmed",
  },
  {
    id: "2",
    client: {
      name: "Juan Pérez",
      email: "juan@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    service: "Clase Mujeres",
    date: "2023-03-15T11:30:00",
    status: "pending",
  },
  {
    id: "3",
    client: {
      name: "Ana Rodríguez",
      email: "ana@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    service: "Clase Infantil",
    date: "2023-03-15T14:00:00",
    status: "confirmed",
  },
  {
    id: "4",
    client: {
      name: "Carlos López",
      email: "carlos@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    service: "Clase Avanzados",
    date: "2023-03-16T09:00:00",
    status: "cancelled",
  },
];

export function RecentAppointments() {
  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={appointment.client.avatar}
              alt={appointment.client.name}
            />
            <AvatarFallback>
              {appointment.client.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">
                {appointment.client.name}
              </p>
              <Badge
                variant={
                  appointment.status === "confirmed"
                    ? "default"
                    : appointment.status === "pending"
                      ? "outline"
                      : "destructive"
                }
              >
                {appointment.status === "confirmed"
                  ? "Confirmada"
                  : appointment.status === "pending"
                    ? "Pendiente"
                    : "Cancelada"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {appointment.service}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(appointment.date).toLocaleString("es-ES", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
