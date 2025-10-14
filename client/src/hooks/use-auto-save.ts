import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseAutoSaveOptions {
  key: string;
  data: any;
  interval?: number; // milliseconds
  enabled?: boolean;
}

export function useAutoSave({ key, data, interval = 30000, enabled = true }: UseAutoSaveOptions) {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(data);
    
    // Don't save if data hasn't changed
    if (currentData === lastSavedRef.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(`autosave_${key}`, currentData);
        lastSavedRef.current = currentData;
        
        if (import.meta.env.DEV) {
          console.log('Auto-saved:', key);
        }
      } catch (error) {
        console.error('Failed to auto-save:', error);
      }
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, key, interval, enabled]);

  const loadSaved = (): any | null => {
    try {
      const saved = localStorage.getItem(`autosave_${key}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
    return null;
  };

  const clearSaved = () => {
    try {
      localStorage.removeItem(`autosave_${key}`);
      lastSavedRef.current = '';
    } catch (error) {
      console.error('Failed to clear saved data:', error);
    }
  };

  const hasSavedData = (): boolean => {
    return localStorage.getItem(`autosave_${key}`) !== null;
  };

  const restoreSaved = () => {
    const saved = loadSaved();
    if (saved) {
      toast({
        title: "Borrador restaurado",
        description: "Se recuperó tu trabajo anterior",
      });
      return saved;
    }
    return null;
  };

  return {
    loadSaved,
    clearSaved,
    hasSavedData,
    restoreSaved,
  };
}
