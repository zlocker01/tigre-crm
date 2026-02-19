import { createClient } from '@/utils/supabase/server';
import { getUserId } from '@/data/getUserIdServer';
import { getUserRole } from '@/data/getUserRole';

export const postClient = async (clientData: any): Promise<boolean> => {
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
    return false;
  }

  const isActive =
    typeof status === 'string'
      ? status === 'active' || status === 'trial'
      : false;

  const payload: Record<string, unknown> = {
    name,
    email: email || null,
    phone: phone || null,
    registration_date: registration_date || new Date().toISOString(),
    birthday: birthday || null,
    notes: notes || null,
    is_active: isActive,
    client_source: userRole || 'empleado',
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

  const { error } = await supabase.from('clients').insert([payload]);

  if (error) {
    console.error('🚀 ~ postClient error:', error);
    return false;
  }

  return true;
};
