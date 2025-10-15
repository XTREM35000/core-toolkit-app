import { supabase } from './supabaseClient';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Appointment = Tables<'appointments'>;
export type CreateAppointment = TablesInsert<'appointments'>;
export type UpdateAppointment = TablesUpdate<'appointments'>;

export async function listAppointments(params?: {
  organizationId?: string;
  clientId?: string;
  vehicleId?: string;
  status?: Appointment['status'];
  fromDate?: string; // ISO
  toDate?: string;   // ISO
}) {
  let query = supabase
    .from('appointments')
    .select('*')
    .order('scheduled_date', { ascending: true });

  if (params?.clientId) query = query.eq('client_id', params.clientId);
  if (params?.vehicleId) query = query.eq('vehicle_id', params.vehicleId);
  if (params?.status) query = query.eq('status', params.status);
  if (params?.fromDate) query = query.gte('scheduled_date', params.fromDate);
  if (params?.toDate) query = query.lte('scheduled_date', params.toDate);

  // Filter by organization via vehicles -> garages or clients -> organization_id is not explicit in schema for appointments.
  // Prefer scoping by client/vehicle for now; callers can pre-filter using their own org context.

  return await query;
}

export async function getAppointment(id: string) {
  return await supabase.from('appointments').select('*').eq('id', id).single();
}

export async function createAppointment(payload: CreateAppointment) {
  return await supabase.from('appointments').insert(payload).select('*').single();
}

export async function updateAppointment(id: string, payload: UpdateAppointment) {
  return await supabase.from('appointments').update(payload).eq('id', id).select('*').single();
}

export async function deleteAppointment(id: string) {
  return await supabase.from('appointments').delete().eq('id', id);
}


