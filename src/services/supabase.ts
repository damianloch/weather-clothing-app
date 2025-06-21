import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserLocation {
  id: string;
  user_id?: string;
  location_name: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
  created_at: string;
}

// Location service functions
export const locationService = {
  async saveLocation(location: Omit<UserLocation, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('user_locations')
      .insert([location])
      .select();
    
    if (error) throw error;
    return data;
  },

  async getUserLocations(userId?: string) {
    let query = supabase
      .from('user_locations')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async updateLocation(id: string, updates: Partial<UserLocation>) {
    const { data, error } = await supabase
      .from('user_locations')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  },

  async deleteLocation(id: string) {
    const { error } = await supabase
      .from('user_locations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getDefaultLocation(userId?: string) {
    let query = supabase
      .from('user_locations')
      .select('*')
      .eq('is_default', true)
      .limit(1);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data?.[0] || null;
  }
};