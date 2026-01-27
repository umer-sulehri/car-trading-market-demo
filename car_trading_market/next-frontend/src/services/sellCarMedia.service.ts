import apiClient from "@/src/lib/api/apiClient";
import { API } from "@/src/lib/api/endpoints";

/* ===================== SELL CAR MEDIA ===================== */

export const uploadSellCarImage = (sellCarId: number, file: File) => {
  const formData = new FormData();
  formData.append("sell_car_id", sellCarId.toString());
  formData.append("media", file);

  return apiClient.post(API.sellCarMedia.create, formData);
};

export const deleteSellCarImage = (mediaId: number) =>
  apiClient.delete(API.sellCarMedia.delete(mediaId));
