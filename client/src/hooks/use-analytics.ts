import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function useAnalytics() {
  useEffect(() => {
    // Initialize Google Analytics if GA_MEASUREMENT_ID is set
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    if (measurementId && !window.gtag) {
      // Load GA script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', measurementId);
    }
  }, []);

  const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (window.gtag) {
      window.gtag('event', eventName, params);
    }
    
    // Also log to console in development
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', eventName, params);
    }
  };

  const trackPageView = (path: string) => {
    if (window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: path,
      });
    }
  };

  const trackTherapyView = (therapyId: string, therapyTitle: string) => {
    trackEvent('view_therapy', {
      therapy_id: therapyId,
      therapy_title: therapyTitle,
    });

    // Also increment view count in backend
    fetch(`/api/therapies/${therapyId}/view`, {
      method: 'POST',
    }).catch(console.error);
  };

  const trackWhatsAppClick = (therapyId: string, therapyTitle: string) => {
    trackEvent('whatsapp_click', {
      therapy_id: therapyId,
      therapy_title: therapyTitle,
    });

    // Also increment click count in backend
    fetch(`/api/therapies/${therapyId}/whatsapp-click`, {
      method: 'POST',
    }).catch(console.error);
  };

  const trackSearch = (searchTerm: string, resultsCount: number) => {
    trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount,
    });
  };

  const trackFilter = (filterType: string, filterValue: string) => {
    trackEvent('filter', {
      filter_type: filterType,
      filter_value: filterValue,
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackTherapyView,
    trackWhatsAppClick,
    trackSearch,
    trackFilter,
  };
}
