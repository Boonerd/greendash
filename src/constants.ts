
import { MarketItem, WeatherData } from './types';

export const TRANSLATIONS = {
  en: {
    welcome: "Habari, Farmer",
    tagline: "Shamba Smart. Harvest Strong.",
    weather: "Weather Forecast",
    temp: "Temperature",
    rain: "Rain Chance",
    market: "Market Prices",
    scan: "Crop Doctor",
    chat: "Ask Agri-Bot",
    profile: "My Shamba",
    actions: "Quick Actions",
    nav_home: "Home",
    nav_scan: "Scan",
    nav_market: "Market",
    nav_chat: "Assistant",
    nav_profile: "Profile",
    buy_fert: "Buy Fertilizer",
    sell_crop: "Sell Produce",
    mpesa_pay: "Pay with M-Pesa",
    processing: "Processing...",
    analyzing: "Analyzing your crop...",
    upload_t: "Take Photo or Upload",
    healthy: "Your crop looks healthy!",
    issue: "Potential issue detected.",
    confidence: "Confidence",
    treatment: "Recommended Action",
    today: "Today in Kiambu",
    loading: "Loading data...",
    error_api: "Connection error. Please try again.",
    save: "Save Changes",
    saved: "Saved Successfully",
    farm_details: "Farm Details",
    location: "Location (County)",
    size: "Farm Size (Acres)",
    crops_grown: "Crops Grown"
  },
  sw: {
    welcome: "Habari, Mkulima",
    tagline: "Shamba Smart. Mavuno Bora.",
    weather: "Utabiri wa Hali ya Hewa",
    temp: "Joto",
    rain: "Uwezekano wa Mvua",
    market: "Bei za Sokoni",
    scan: "Daktari wa Mimea",
    chat: "Uliza Agri-Bot",
    profile: "Shamba Langu",
    actions: "Hatua za Haraka",
    nav_home: "Nyumbani",
    nav_scan: "Chunguza",
    nav_market: "Soko",
    nav_chat: "Msaidizi",
    nav_profile: "Wasifu",
    buy_fert: "Nunua Mbolea",
    sell_crop: "Uza Mazao",
    mpesa_pay: "Lipa na M-Pesa",
    processing: "Inachakata...",
    analyzing: "Inachunguza mmea wako...",
    upload_t: "Piga Picha au Pakia",
    healthy: "Mmea wako unaonekana kuwa na afya!",
    issue: "Tatizo limegunduliwa.",
    confidence: "Uhakika",
    treatment: "Hatua Inayopendekezwa",
    today: "Leo huko Kiambu",
    loading: "Inapakia data...",
    error_api: "Tatizo la mtandao. Tafadhali jaribu tena.",
    save: "Hifadhi Mabadiliko",
    saved: "Imehifadhiwa",
    farm_details: "Maelezo ya Shamba",
    location: "Mahali (Kaunti)",
    size: "Ukubwa wa Shamba (Ekari)",
    crops_grown: "Mazao Unayolima"
  }
};

export const MOCK_WEATHER: WeatherData = {
  temp: 24,
  condition: "Partly Cloudy",
  icon: "cloud-sun",
  rainChance: 30,
  advice: {
    en: "Good conditions for drying coffee beans today.",
    sw: "Hali nzuri ya kukausha kahawa leo."
  }
};

export const MOCK_MARKET_DATA: MarketItem[] = [
  {
    id: '1',
    name: { en: 'Coffee (Grade AA)', sw: 'Kahawa (Grade AA)' },
    price: 650,
    unit: 'kg',
    trend: 'up',
    change: '+5%'
  },
  {
    id: '2',
    name: { en: 'Maize (Dry)', sw: 'Mahindi (Makavu)' },
    price: 5500,
    unit: '90kg bag',
    trend: 'stable',
    change: '0%'
  },
  {
    id: '3',
    name: { en: 'Avocado (Hass)', sw: 'Parachichi (Hass)' },
    price: 15,
    unit: 'pc',
    trend: 'up',
    change: '+12%'
  },
  {
    id: '4',
    name: { en: 'Tea Leaves', sw: 'Majani ya Chai' },
    price: 25,
    unit: 'kg',
    trend: 'down',
    change: '-2%'
  }
];

export const COUNTIES = [
  "Kiambu", "Murang'a", "Nyeri", "Kirinyaga", "Embu", "Meru", 
  "Machakos", "Makueni", "Kisii", "Nyamira", "Kericho", "Bomet", 
  "Uasin Gishu", "Trans Nzoia", "Bungoma", "Kakamega"
];

export const CROPS_LIST = [
  "Coffee", "Tea", "Maize", "Beans", "Avocado", "Bananas", "Potatoes", "Tomatoes", "Cabbage", "Sukuma Wiki"
];