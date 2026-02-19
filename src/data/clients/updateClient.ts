import { createClient } from '@/utils/supabase/server';
import type { Client } from '@/interfaces/client/Client';

export const updateClient = async (
  id: string,
  clientData: Partial<Client>,
): Promise<string | undefined> => {
  const supabase = await createClient();

  const { appointments, ...rest } = clientData as any;

  const payload: Record<string, unknown> = {};

  if (rest.name !== undefined) {
    payload.name = rest.name;
  }
  if (rest.email !== undefined) {
    payload.email = rest.email || null;
  }
  if (rest.phone !== undefined) {
    payload.phone = rest.phone || null;
  }
  if (rest.registration_date !== undefined) {
    payload.registration_date = rest.registration_date;
  }
  if (rest.birthday !== undefined) {
    payload.birthday = rest.birthday || null;
  }
  if (rest.notes !== undefined) {
    payload.notes = rest.notes || null;
  }

  if (rest.status !== undefined) {
    payload.is_active =
      rest.status === 'active' || rest.status === 'trial' ? true : false;
  }

  if (rest.package_id !== undefined) {
    if (rest.package_id === '') {
      payload.package_id = null;
    } else {
      const numericPid =
        typeof rest.package_id === 'string'
          ? Number(rest.package_id)
          : rest.package_id;
      if (!Number.isNaN(numericPid) && Number.isFinite(numericPid)) {
        (payload as any).package_id = numericPid;
      }
    }
  }

  const { error } = await supabase
    .from('clients')
    .update(payload)
    .eq('id', id);

  if (error) {
    console.error('❌ updateClient DB Error:', error);
    return error.message;
  }

  return;
};
