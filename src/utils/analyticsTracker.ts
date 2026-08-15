// Módulo de Analíticas Reales para Jovas Portfolio
// Rastrea visitas reales, visitantes únicos, vistas de proyectos y clicks de contacto sin depender de servicios externos pesados.

export interface AnalyticsData {
  totalPageViews: number;
  uniqueVisitors: number;
  totalProjectViews: number;
  totalContactClicks: number;
  projectViewsMap: Record<string, number>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  dailyVisits: Record<string, number>;
  lastUpdated: string;
}

const STORAGE_KEY = 'jovas_portfolio_v5_analytics';
const VISITOR_ID_KEY = 'jovas_visitor_id';

const getInitialAnalytics = (): AnalyticsData => ({
  totalPageViews: 0,
  uniqueVisitors: 0,
  totalProjectViews: 0,
  totalContactClicks: 0,
  projectViewsMap: {},
  deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
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
        ...parsed
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
