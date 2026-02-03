export interface Make {
  id: number;
  name: string;
  logo?: string;
}

export interface CarModel {
  id: number;
  name: string;
  make_id: number;
  make?: Make;
    media?: Array<{ id: number; url: string }>; 
}

export interface Version {
  id: number;
  name: string;
  cc?: number;
  year: number;
  model_id: number;
  make_id: number;
  engine_type_id: number;
  transmission_id: number;
  model?: CarModel;
  make?: Make;
  engineType?: { id: number; name: string };
  transmission?: { id: number; name: string };
  features?: Feature[];
}


export interface FeatureType {
  id: number;
  name: string;
}

export interface Feature {
  id: number;
  name: string;
  value?: string;
  is_visible: boolean;
  type?: FeatureType; // include type info
}
export interface SpecificationType {
  id: number;
  name: string;
}
export interface Specification {
  id: number;
  name: string;
  value?: string;
  type?: SpecificationType; // optional relation
   is_visible?: boolean;
}


export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  province: Province;
  province_id: number;
}
export interface SellCarResponse {
  id?: number;
  version_id?: number;
  make_id?: number;
  seller_city_id?: number;
  registered_city?: string;
  registered_province?: string;
  mileage?: number;
  price?: number;
  engine_type_id?: number;
  engine?: string;
  capacity?: number;
  transmission_id?: number;
  assembly_type?: string;
  seller_name?: string;
  seller_phone?: string;
  secondary_phone?: string;
  whatsapp_allowed?: boolean;
  description?: string;
  year?: number;
  version?: Version;
  make?: Make;
  city?: City;
  engineType?: { id: number; name: string };
  transmission?: { id: number; name: string };
  media?: Array<{ id: number; url: string }>;
  features?: Feature[];
  user_id?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  data?: any;
}
