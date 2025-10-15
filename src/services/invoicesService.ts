import { supabase } from './supabaseClient';

export interface Invoice {
  id: string;
  number: string;
  client_id: string | null;
  total_amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string | null;
  created_at?: string;
}

export async function listInvoices() {
  return await supabase.from('invoices').select('*, clients(first_name,last_name)').order('created_at', { ascending: false });
}

export async function createInvoice(payload: Omit<Invoice, 'id' | 'created_at'>) {
  return await supabase.from('invoices').insert(payload).select().single();
}

export async function updateInvoice(id: string, payload: Partial<Omit<Invoice, 'id'>>) {
  return await supabase.from('invoices').update(payload).eq('id', id).select().single();
}

export async function deleteInvoice(id: string) {
  return await supabase.from('invoices').delete().eq('id', id);
}


