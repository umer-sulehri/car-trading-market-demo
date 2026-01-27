import { GET } from "@/src/lib/api/get.service";
import { PUT } from "@/src/lib/api/put.service";
import { API } from "@/src/lib/api/endpoints";

export interface AdminCar {
  id: number;
  make: string;
  model: string;
  price: number;
  status: "Pending" | "Accepted" | "Rejected";
  user: {
    name: string;
    email: string;
  };
}

export const getAllCars = () => {
  return GET<AdminCar[]>(API.admin.cars); // This is fine
};

// ✅ Corrected updateCarStatus using PUT service
export const updateCarStatus = (
  carId: number,
  status: "Accepted" | "Rejected",
  comment?: string
) => {
  return PUT(`/admin/cars/${carId}/status`, { status, comment });
};
