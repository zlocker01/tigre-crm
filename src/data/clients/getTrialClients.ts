import { createClient } from '@/utils/supabase/server';
import type { Client } from '@/interfaces/client/Client';

export const getTrialClients = async (
  limit = 10,
): Promise<Client[] | undefined> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('status', 'trial')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('🚀 ~ getTrialClients error:', error.message);
    return undefined;
  }

  return data as Client[];
};
