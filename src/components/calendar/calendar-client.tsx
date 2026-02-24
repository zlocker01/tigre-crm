"use client";

import { useState } from "react";
import { AppointmentCalendar } from "./AppointmentCalendar";
import { AppointmentDetails } from "./AppointmentDetails";
import { AppointmentForm } from "./AppointmentForm";
import type { ClassSession } from "@/interfaces/appointments/Appointment";
import { ClientForm } from "../clients/client-form";

interface CalendarClientProps {
  selectedDate: Date;
  selectedAppointment: any;
  isCreating: boolean;
  isEditing: boolean;
  clients: any[];
  services: any[];
  promotions: any[];
  appointments: ClassSession[];
  onDateChange: (date: Date) => void;
  onAppointmentSelect: (appointment: any) => void;
  onCreateAppointment: () => void;
  onEditAppointment: (appointment: any) => void;
  onCancelEdit: () => void;
  onAppointmentSubmit: (data: any) => Promise<void>;
}

export function CalendarClient({
  selectedDate,
  selectedAppointment,
  isCreating,
  isEditing,
  clients,
  services,
  promotions,
  appointments,
  onDateChange,
  onAppointmentSelect,
  onCreateAppointment,
  onEditAppointment,
  onCancelEdit,
  onAppointmentSubmit,
}: CalendarClientProps) {
  const [view, setView] = useState<"month" | "week" | "day">("month");

  return (
    <div className="flex flex-col gap-4">
      {/* ... UI del encabezado ... */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 order-2 lg:order-1">
          <AppointmentCalendar
            view={view}
            appointments={appointments}
            isLoading={false}
            error={null}
            onViewChange={setView}
            onDateChange={onDateChange}
            onAppointmentSelect={onAppointmentSelect}
          />
        </div>
        <div className="w-full lg:w-96 order-1 lg:order-2">
          {isCreating || isEditing ? (
            <AppointmentForm
              appointment={isEditing ? selectedAppointment : undefined}
              services={services}
              onSubmit={onAppointmentSubmit}
              onCancel={onCancelEdit}
            />
          ) : (
            <AppointmentDetails
              appointment={selectedAppointment}
              onEdit={onEditAppointment}
              onCreateNew={onCreateAppointment}
              onClose={onCancelEdit}
              clients={clients}
              services={services}
            />
          )}
        </div>
      </div>
    </div>
  );
}
