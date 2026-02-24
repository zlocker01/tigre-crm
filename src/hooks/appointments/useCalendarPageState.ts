import { useState } from "react";
import type { ClassSession } from "@/interfaces/appointments/Appointment";

// hooks/useCalendarPageState.ts
export function useCalendarPageState(landingId: string) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<ClassSession | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleCreateAppointment = () => {
    setSelectedAppointment(null);
    setIsFormOpen(true);
    setIsEditing(false);
  };

  const handleEditAppointment = (appointment: ClassSession) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
    setIsEditing(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedAppointment(null);
  };

  return {
    selectedAppointment,
    isFormOpen,
    isEditing,
    selectedDate,
    handleCreateAppointment,
    handleEditAppointment,
    handleCloseForm,
    setSelectedDate,
  };
}
