import { supabase } from '@/integrations/supabase/client';

export const organizationService = {
  // Récupérer les garages d'une organisation
  getGaragesByOrganization: async (organizationId: string) => {
    const { data, error } = await supabase
      .from('garages')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Récupérer les interventions d'une organisation
  getInterventionsByOrganization: async (organizationId: string) => {
    const { data, error } = await supabase
      .from('interventions')
      .select(`
        *,
        vehicles (*, clients (*)),
        profiles:mechanic_id (*)
      `)
      .eq('vehicles.clients.organization_id', organizationId);
    
    if (error) throw error;
    return data;
  },

  // Récupérer les clients d'une organisation
  getClientsByOrganization: async (organizationId: string) => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('organization_id', organizationId);
    
    if (error) throw error;
    return data;
  },

  // Récupérer les véhicules d'une organisation
  getVehiclesByOrganization: async (organizationId: string) => {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        clients (*)
      `)
      .eq('clients.organization_id', organizationId);
    
    if (error) throw error;
    return data;
  },

  // Récupérer les factures d'une organisation
  getInvoicesByOrganization: async (organizationId: string) => {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (*)
      `)
      .eq('clients.organization_id', organizationId);
    
    if (error) throw error;
    return data;
  },

  // Récupérer les rendez-vous d'une organisation
  getAppointmentsByOrganization: async (organizationId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        clients (*),
        garages (*)
      `)
      .eq('clients.organization_id', organizationId);
    
    if (error) throw error;
    return data;
  },

  // Vérifier les limites d'organisation
  getOrganizationLimits: async (organizationId: string) => {
    const [garagesCount, clientsCount, usersCount] = await Promise.all([
      supabase.from('garages').select('id', { count: 'exact' }).eq('organization_id', organizationId),
      supabase.from('clients').select('id', { count: 'exact' }).eq('organization_id', organizationId),
      supabase.from('user_organization').select('id', { count: 'exact' }).eq('organization_id', organizationId)
    ]);

    return {
      garages: garagesCount.count || 0,
      clients: clientsCount.count || 0,
      users: usersCount.count || 0
    };
  },

  // Créer un garage pour une organisation
  createGarage: async (organizationId: string, garageData: any) => {
    const { data, error } = await supabase
      .from('garages')
      .insert([{
        ...garageData,
        organization_id: organizationId
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Créer un client pour une organisation
  createClient: async (organizationId: string, clientData: any) => {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        ...clientData,
        organization_id: organizationId
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Créer un véhicule pour une organisation
  createVehicle: async (organizationId: string, vehicleData: any) => {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([{
        ...vehicleData,
        organization_id: organizationId
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Créer une intervention pour une organisation
  createIntervention: async (organizationId: string, interventionData: any) => {
    const { data, error } = await supabase
      .from('interventions')
      .insert([{
        ...interventionData,
        organization_id: organizationId
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
