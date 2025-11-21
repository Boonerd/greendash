
export type Language = 'en' | 'sw';

export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  rainChance: number;
  advice: {
    en: string;
    sw: string;
  };
}

export interface MarketItem {
  id: string;
  name: {
    en: string;
    sw: string;
  };
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

export type View = 'home' | 'scan' | 'market' | 'chat' | 'profile';

export interface CropAnalysisResult {
  diagnosis: string;
  confidence: number;
  treatment: string;
  healthy: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  county: string;
  farmSize: string;
  crops: string[];
}