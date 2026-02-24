import { createClient } from '@/utils/supabase/server';
import { getUserId } from '@/data/getUserIdServer';
import { getUserRole } from '@/data/getUserRole';

export const postClient = async (
  clientData: any
): Promise<{ success: boolean; client?: any }> => {
  const supabase = await createClient();
  const userId = await getUserId();
  const userRole = await getUserRole();

  const {
    name,
    email,
    phone,
    registration_date,
    birthday,
    notes,
    status,
    package_id,
  } = clientData || {};

  if (!name || typeof name !== 'string') {
    console.error('postClient error: name is required');
    return { success: false };
  }

  // Si no se especifica status, usar 'trial' por defecto para nuevos registros desde landing
  const clientStatus = status || 'trial';
  
  const isActive =
    typeof clientStatus === 'string'
      ? clientStatus === 'active' || clientStatus === 'trial'
      : false;

  const payload: Record<string, unknown> = {
    name,
    email: email || null,
    phone: phone || null,
    registration_date: registration_date || new Date().toISOString(),
    birthday: birthday || null,
    notes: notes || null,
    status: clientStatus,
    client_source: userRole || 'landing_page', // Indicar que viene de landing si no hay rol
  };

  if (package_id !== undefined && package_id !== '') {
    const numericPid =
      typeof package_id === 'string' ? Number(package_id) : package_id;
    if (!Number.isNaN(numericPid) && Number.isFinite(numericPid)) {
      (payload as any).package_id = numericPid;
    }
  }

  if (userId) {
    payload.user_id = userId;
  }

  const { data, error } = await supabase
    .from('clients')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('🚀 ~ postClient error:', error);
    return { success: false };
  }

  return { success: true, client: data };
};
