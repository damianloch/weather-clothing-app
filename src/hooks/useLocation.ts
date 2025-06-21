import { useState, useEffect, useCallback } from 'react';
import { LocationData } from '../types/weather';
import { weatherService } from '../services/weatherApi';
import { locationService, UserLocation } from '../services/supabase';

interface UseLocationState {
  currentLocation: LocationData | null;
  savedLocations: UserLocation[];
  loading: boolean;
  error: string | null;
}

interface UseLocationReturn extends UseLocationState {
  getCurrentLocation: () => Promise<LocationData>;
  saveLocation: (location: Omit<UserLocation, 'id' | 'created_at'>) => Promise<void>;
  loadSavedLocations: () => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  setDefaultLocation: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const [state, setState] = useState<UseLocationState>({
    currentLocation: null,
    savedLocations: [],
    loading: false,
    error: null,
  });

  const getCurrentLocation = useCallback(async (): Promise<LocationData> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const location = await weatherService.getCurrentLocation();
      setState(prev => ({ 
        ...prev, 
        currentLocation: location, 
        loading: false 
      }));
      return location;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get current location';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      throw error;
    }
  }, []);

  const loadSavedLocations = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const locations = await locationService.getUserLocations();
      setState(prev => ({ 
        ...prev, 
        savedLocations: locations || [], 
        loading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load saved locations';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, []);

  const saveLocation = useCallback(async (location: Omit<UserLocation, 'id' | 'created_at'>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await locationService.saveLocation(location);
      // Reload locations after saving
      const locations = await locationService.getUserLocations();
      setState(prev => ({ 
        ...prev, 
        savedLocations: locations || [], 
        loading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save location';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, []);

  const deleteLocation = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await locationService.deleteLocation(id);
      setState(prev => ({ 
        ...prev, 
        savedLocations: prev.savedLocations.filter(loc => loc.id !== id),
        loading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete location';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, []);

  const setDefaultLocation = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // First, set all locations to non-default
      const updatePromises = state.savedLocations.map(loc => 
        locationService.updateLocation(loc.id, { is_default: false })
      );
      await Promise.all(updatePromises);
      
      // Then set the selected location as default
      await locationService.updateLocation(id, { is_default: true });
      
      // Reload locations to get updated state
      const locations = await locationService.getUserLocations();
      setState(prev => ({ 
        ...prev, 
        savedLocations: locations || [], 
        loading: false 
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set default location';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, [state.savedLocations]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load saved locations on mount
  useEffect(() => {
    loadSavedLocations();
  }, [loadSavedLocations]);

  return {
    ...state,
    getCurrentLocation,
    saveLocation,
    loadSavedLocations,
    deleteLocation,
    setDefaultLocation,
    clearError,
  };
};