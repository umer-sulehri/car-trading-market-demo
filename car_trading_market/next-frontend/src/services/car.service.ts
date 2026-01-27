import { API } from "@/src/lib/api/endpoints";
import { GET } from "@/src/lib/api/get.service";
import { POST } from "@/src/lib/api/post.service";
import { PUT } from "@/src/lib/api/put.service";
import apiClient from "@/src/lib/api/apiClient";

export interface Car {
  id: number;
  year: number;
  city: string;
  address: string;
  make: string;
  model: string;
  version?: string;
  registration_status: string;
  registration_city?: string;
  exterior_color: string;
  mileage: number;
  price: number;
  description?: string;
  seller_name: string;
  phone: string;
  secondary_phone?: string;
  email: string;
  availability_status: string;
  images?: string[];
}


/* ========================= USER CARS ========================= */

export const getMyCars = () => {
  return GET<Car[]>(API.cars.myCars);
};

export const getCarById = (id: number) => {
  return GET<Car>(API.cars.byId(id));
};

export const createCar = (data: FormData) => {
  return POST(API.cars.create, data);
};

export const updateCar = (id: number, data: FormData) => {
  data.append("_method", "PUT"); // 🔥 important
  return POST(API.cars.update(id), data);
};

export const deleteCar = (id: number) => {
  return apiClient.delete(API.cars.delete(id));
};

export const getPublicCars = (params?: {
  city?: string;
  make?: string;
  model?: string;
  price?: string;
  search?: string;
   limit?: number;
  offset?: number;
}) => {
  return GET<Car[]>("/public/cars", params );
};

export const getPublicCarById = (id: number) => {
  return GET<Car>(`/public/cars/${id}`);
};

