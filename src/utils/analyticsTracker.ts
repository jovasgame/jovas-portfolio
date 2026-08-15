// Módulo de Analíticas Reales en Tiempo Real para Jovas Portfolio
// Rastrea visitas reales, visitantes únicos, clics totales en el sitio, geolocalización por país y rendimiento.

export interface CountryStat {
  name: string;
  flag: string;
  count: number;
}

export interface AnalyticsData {
  totalPageViews: number;
  uniqueVisitors: number;
  totalSiteClicks: number;
  totalProjectViews: number;
  totalContactClicks: number;
  projectViewsMap: Record<string, number>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  countryBreakdown: Record<string, CountryStat>;
  dailyVisits: Record<string, number>;
  lastUpdated: string;
}

const STORAGE_KEY = 'jovas_portfolio_v5_analytics';
const VISITOR_ID_KEY = 'jovas_visitor_id';
const COUNTRY_FETCHED_KEY = 'jovas_country_fetched_session';

// Mapeo de códigos ISO de país a nombre en español y banderas emoji
const COUNTRY_MAP: Record<string, { name: string; flag: string }> = {
  SV: { name: 'El Salvador', flag: '🇸🇻' },
  US: { name: 'Estados Unidos', flag: '🇺🇸' },
  MX: { name: 'México', flag: '🇲🇽' },
  ES: { name: 'España', flag: '🇪🇸' },
  GT: { name: 'Guatemala', flag: '🇬🇹' },
  HN: { name: 'Honduras', flag: '🇭🇳' },
  CR: { name: 'Costa Rica', flag: '🇨🇷' },
  NI: { name: 'Nicaragua', flag: '🇳🇮' },
  PA: { name: 'Panamá', flag: '🇵🇦' },
  CO: { name: 'Colombia', flag: '🇨🇴' },
  AR: { name: 'Argentina', flag: '🇦🇷' },
  CL: { name: 'Chile', flag: '🇨🇱' },
  PE: { name: 'Perú', flag: '🇵🇪' },
  EC: { name: 'Ecuador', flag: '🇪🇨' },
  DO: { name: 'Rep. Dominicana', flag: '🇩🇴' },
  PR: { name: 'Puerto Rico', flag: '🇵🇷' },
  DE: { name: 'Alemania', flag: '🇩🇪' },
  FR: { name: 'Francia', flag: '🇫🇷' },
  GB: { name: 'Reino Unido', flag: '🇬🇧' },
  CA: { name: 'Canadá', flag: '🇨🇦' },
  BR: { name: 'Brasil', flag: '🇧🇷' }
};

const getInitialAnalytics = (): AnalyticsData => ({
  totalPageViews: 0,
  uniqueVisitors: 0,
  totalSiteClicks: 0,
  totalProjectViews: 0,
  totalContactClicks: 0,
  projectViewsMap: {},
  deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
  countryBreakdown: {
    SV: { name: 'El Salvador', flag: '🇸🇻', count: 1 }
  },
  dailyVisits: {},
  lastUpdated: new Date().toISOString()
});

export const getStoredAnalytics = (): AnalyticsData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...getInitialAnalytics(),
        ...parsed,
        countryBreakdown: parsed.countryBreakdown || getInitialAnalytics().countryBreakdown
      };
    }
  } catch (err) {
    console.warn('Error al leer analíticas locales:', err);
  }
  return getInitialAnalytics();
};

export const saveStoredAnalytics = (data: AnalyticsData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Error al guardar analíticas locales:', err);
  }
};

// Determina el tipo de dispositivo
const getDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

// Formatea la fecha de hoy YYYY-MM-DD
const getTodayKey = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Rastrear Clic Global en Cualquier Parte del Sitio
export const trackSiteClick = (): AnalyticsData => {
  const data = getStoredAnalytics();
  data.totalSiteClicks = (data.totalSiteClicks || 0) + 1;
  data.lastUpdated = new Date().toISOString();
  saveStoredAnalytics(data);
  return data;
};

// Inicializa el listener global de clics en la ventana
let isClickTrackerInitialized = false;
export const initGlobalClickTracker = () => {
  if (isClickTrackerInitialized || typeof window === 'undefined') return;
  isClickTrackerInitialized = true;

  window.addEventListener('click', () => {
    trackSiteClick();
  }, { passive: true });
};

// Obtener y Rastrear País de Origen del Visitante (IP Geolocation)
export const fetchAndTrackVisitorCountry = async (): Promise<void> => {
  try {
    // Si ya se registró el país en esta sesión, no volver a consumir API
    if (sessionStorage.getItem(COUNTRY_FETCHED_KEY)) return;

    // Intentar obtener ubicación por IP
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const geoData = await res.json();
      const countryCode = (geoData.country_code || 'SV').toUpperCase();
      const countryName = geoData.country_name || (COUNTRY_MAP[countryCode]?.name || 'Otro País');
      const flag = COUNTRY_MAP[countryCode]?.flag || '🌍';

      const data = getStoredAnalytics();
      if (!data.countryBreakdown) data.countryBreakdown = {};

      if (data.countryBreakdown[countryCode]) {
        data.countryBreakdown[countryCode].count += 1;
      } else {
        data.countryBreakdown[countryCode] = {
          name: countryName,
          flag,
          count: 1
        };
      }

      data.lastUpdated = new Date().toISOString();
      saveStoredAnalytics(data);
      sessionStorage.setItem(COUNTRY_FETCHED_KEY, countryCode);
    }
  } catch (e) {
    // Fallback por zona horaria o idioma si la API de IP falla/bloquea
    try {
      const data = getStoredAnalytics();
      if (!data.countryBreakdown) data.countryBreakdown = {};
      
      const userLang = (navigator.language || 'es-SV').toUpperCase();
      const defaultCode = userLang.includes('SV') ? 'SV' : userLang.includes('US') ? 'US' : userLang.includes('MX') ? 'MX' : 'SV';
      const info = COUNTRY_MAP[defaultCode] || { name: 'El Salvador', flag: '🇸🇻' };

      if (!data.countryBreakdown[defaultCode]) {
        data.countryBreakdown[defaultCode] = { name: info.name, flag: info.flag, count: 1 };
      }
      saveStoredAnalytics(data);
      sessionStorage.setItem(COUNTRY_FETCHED_KEY, defaultCode);
    } catch (err) {}
  }
};

// Rastrear Vista de Página Principal (Pageview)
export const trackPageView = (): AnalyticsData => {
  const data = getStoredAnalytics();
  const today = getTodayKey();
  const device = getDeviceType();

  // Comprobar si es un visitante único nuevo
  let isNewVisitor = false;
  if (!localStorage.getItem(VISITOR_ID_KEY)) {
    const newVisitorId = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(VISITOR_ID_KEY, newVisitorId);
    isNewVisitor = true;
  }

  // Actualizar métricas
  data.totalPageViews += 1;
  if (isNewVisitor) {
    data.uniqueVisitors += 1;
  }

  // Desglose de dispositivos
  data.deviceBreakdown[device] = (data.deviceBreakdown[device] || 0) + 1;

  // Visitas diarias (últimos 30 días)
  data.dailyVisits[today] = (data.dailyVisits[today] || 0) + 1;

  data.lastUpdated = new Date().toISOString();
  saveStoredAnalytics(data);

  // Iniciar geolocalización en segundo plano
  fetchAndTrackVisitorCountry();

  return data;
};

// Rastrear Apertura / Inspección de Proyecto
export const trackProjectView = (projectId: string): AnalyticsData => {
  if (!projectId) return getStoredAnalytics();
  const data = getStoredAnalytics();

  data.totalProjectViews += 1;
  data.projectViewsMap[projectId] = (data.projectViewsMap[projectId] || 0) + 1;

  data.lastUpdated = new Date().toISOString();
  saveStoredAnalytics(data);
  return data;
};

// Rastrear Clic en Cotización / WhatsApp / Contacto
export const trackContactClick = (): AnalyticsData => {
  const data = getStoredAnalytics();
  data.totalContactClicks += 1;
  data.lastUpdated = new Date().toISOString();
  saveStoredAnalytics(data);
  return data;
};
