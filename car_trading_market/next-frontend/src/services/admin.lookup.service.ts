import apiClient from "@/src/lib/api/apiClient";
import { GET } from "@/src/lib/api/get.service";
import { PUT } from "@/src/lib/api/put.service";
import { POST } from "@/src/lib/api/post.service";
import { API } from "@/src/lib/api/endpoints";

import { Make, CarModel, Version, Feature, City, Province } from "@/src/types/lookups";

/* ===================== MAKES ===================== */

export const getMakes = async (): Promise<Make[]> => {
  const token = localStorage.getItem("token");
  const res = token
    ? await GET<any>(API.admin.makes) // protected
    : await GET<any>("/makes");       // public

  return Array.isArray(res) ? res : res?.data ?? [];
};

export const createMake = (data: FormData) =>
  POST(API.admin.makes, data);


export const updateMake = (id: number, data: { name: string }) =>
  PUT(`${API.admin.makes}/${id}`, data);

export const deleteMake = (id: number) =>
  apiClient.delete(`${API.admin.makes}/${id}`);

/* ===================== MODELS ===================== */
export const getModels = async (): Promise<CarModel[]> => {
  const token = localStorage.getItem("token");

  const res = token
    ? await GET<any>(API.admin.models) // protected
    : await GET<any>("/models");       // public

  return Array.isArray(res) ? res : res?.data ?? [];
};


export const createModel = (data: { name: string; make_id: number }) =>
  POST(API.admin.models, data);

export const deleteModel = (id: number) =>
  apiClient.delete(`${API.admin.models}/${id}`);


/* ===================== VERSIONS ===================== */
export const getVersions = async (): Promise<Version[]> => {
  const res = await GET<any>(API.admin.versions);
  return Array.isArray(res) ? res : res.data ?? [];
};

export const createVersion = (data: {
  name: string;
  model_id: number;
  make_id: number;
  year: number;
  engine_type_id: number;
  transmission_id: number;
  cc?: number;
}) => POST(API.admin.versions, data);

export const deleteVersion = (id: number) =>
  apiClient.delete(`${API.admin.versions}/${id}`);

/* ===================== FEATURES ===================== */
export const getFeatures = (): Promise<Feature[]> =>
  GET<Feature[]>(API.admin.features);


export const createFeature = (data: Feature) =>
  POST(API.admin.features, data);

export const deleteFeature = (id: number) =>
  apiClient.delete(`${API.admin.features}/${id}`);

/* ===================== CITIES ===================== */
export const getProvinces = (): Promise<Province[]> =>
  GET("/provinces");

export const getCities = (): Promise<City[]> =>
  GET(API.admin.cities);

export const createCity = (data: { name: string; province_id: number }) =>
  POST(API.admin.cities, data);

export const deleteCity = (id: number) =>
  apiClient.delete(`${API.admin.cities}/${id}`);

/* ===================== ENGINE TYPES ===================== */
export const getEngineTypes = (): Promise<{ id: number; name: string }[]> => GET(API.admin.engineTypes);

/* ===================== TRANSMISSIONS ===================== */
export const getTransmissions = (): Promise<{ id: number; name: string }[]> => GET(API.admin.transmissions);

/* ===================== VERSION FEATURES ===================== */
export const getVersionFeatures = (versionId: number) =>
  GET<{ id: number; name: string }[]>(`${API.admin.versions}/${versionId}/features`);

export const updateVersionFeatures = (versionId: number, featureIds: number[]) =>
  POST(`${API.admin.versions}/${versionId}/features`, { feature_ids: featureIds });

export const removeVersionFeature = (versionId: number, featureId: number) =>
  apiClient.delete(`${API.admin.versions}/${versionId}/features/${featureId}`);

/* ===================== PUBLIC LOOKUPS ===================== */

// Makes
export const getPublicMakes = (): Promise<Make[]> => {
  return GET<any>("/makes").then((res) => {
    return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
  });
};

// Models by Make
export const getPublicModels = (makeId: number): Promise<CarModel[]> => {
  return GET<any>(`/models?make_id=${makeId}`).then((res) => {
    return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
  });
};

// Versions by Model
export const getPublicVersions = (modelId: number): Promise<Version[]> => {
  return GET<any>(`/versions?model_id=${modelId}`).then((res) => {
    return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
  });
};

// Cities
export const getPublicCities = (): Promise<City[]> =>
  GET<City[]>("/cities");

// Engine Types
export const getPublicEngineTypes = (): Promise<{ id: number; name: string }[]> =>
  GET("/engine-types");

// Transmissions
export const getPublicTransmissions = (): Promise<{ id: number; name: string }[]> =>
  GET("/transmissions");

// Provinces (optional)
export const getPublicProvinces = (): Promise<Province[]> =>
  GET("/provinces");

export const getPublicFeatures = (): Promise<Feature[]> =>
  GET("/features");


