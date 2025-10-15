import { supabase } from './supabaseClient';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number | null;
  license_plate: string | null;
  vin: string | null;
  client_id: string | null;
  garage_id: string | null;
  created_at?: string;
}

export async function listVehicles() {
  return await supabase.from('vehicles').select('*, clients(first_name,last_name)').order('created_at', { ascending: false });
}

export async function createVehicle(payload: Omit<Vehicle, 'id' | 'created_at'>) {
  return await supabase.from('vehicles').insert(payload).select().single();
}

export async function updateVehicle(id: string, payload: Partial<Omit<Vehicle, 'id'>>) {
  return await supabase.from('vehicles').update(payload).eq('id', id).select().single();
}

export async function deleteVehicle(id: string) {
  return await supabase.from('vehicles').delete().eq('id', id);
}


