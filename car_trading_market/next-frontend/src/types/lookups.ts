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
}


export interface Feature {
  id: number;
  name: string;
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
  id: number;
}
