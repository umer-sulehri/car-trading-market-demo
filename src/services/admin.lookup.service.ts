import apiClient from "@/src/lib/api/apiClient";
import { GET } from "@/src/lib/api/get.service";
import { PUT } from "@/src/lib/api/put.service";
import { POST } from "@/src/lib/api/post.service";
import { API } from "@/src/lib/api/endpoints";

import { Make, CarModel, Version, Feature, City, Province, FeatureType, Specification } from "@/src/types/lookups";

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

/* ===================== FEATURE TYPES ===================== */

export const getFeatureTypes = (): Promise<{ id: number; name: string }[]> => GET(API.admin.featureTypes);

/* ===================== FEATURES ===================== */
export const getFeatures = (): Promise<Feature[]> =>
  GET<Feature[]>(API.admin.features);


export const createFeature = (data: {  name: string;
  car_feature_type_id: number;
  is_visible: boolean;
  value?: string; }) =>
  POST(API.admin.features, data);

export const deleteFeature = (id: number) =>
  apiClient.delete(`${API.admin.features}/${id}`);

/* ===================== SPECIFICATION TYPES ===================== */
export const getSpecificationTypes = (): Promise<{ id: number; name: string }[]> => GET(API.admin.specificationTypes);

/* ===================== SPECIFICATIONS ===================== */
export const getSpecifications = (): Promise<Specification[]> =>
  GET<Specification[]>(API.admin.specifications);

export const createSpecification = (data: { name: string; car_specification_type_id: number }) =>
  POST(API.admin.specifications, data);

export const deleteSpecification = (id: number) =>
  apiClient.delete(`${API.admin.specifications}/${id}`);
/* ===================== VERSION SPECIFICATIONS ===================== */
export const getVersionSpecifications = (versionId: number) =>
  GET<{ specification_id: number; value: string; name: string; type: { id: number; name: string } }[]>(
    `${API.admin.versions}/${versionId}/specifications`
  );

export const updateVersionSpecifications = (
  versionId: number,
  data: { specification_id: number; value: string }[]
) =>
  POST(`${API.admin.versions}/${versionId}/specifications`, { specifications: data });

export const removeVersionSpecification = (versionId: number, specificationId: number) =>
  apiClient.delete(`${API.admin.versions}/${versionId}/specifications/${specificationId}`);

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

/* ===================== COLORS ===================== */
export const getColors = (): Promise<{ id: number; name: string; hex_code: string }[]> =>
  GET(API.admin.colors);

/* ===================== VERSION FEATURES ===================== */
export const getVersionFeatures = (versionId: number) =>
  GET<{ id: number; name: string }[]>(`${API.admin.versions}/${versionId}/features`);

export const updateVersionFeatures = (versionId: number, featureIds: number[]) =>
  POST(`${API.admin.versions}/${versionId}/features`, { feature_ids: featureIds });

export const removeVersionFeature = (versionId: number, featureId: number) =>
  apiClient.delete(`${API.admin.versions}/${versionId}/features/${featureId}`);

/* ===================== VERSION COLORS ===================== */
export const getVersionColors = (versionId: number) =>
  GET<{ id: number; name: string; hex_code: string }[]>(`${API.admin.versions}/${versionId}/colors`);

export const updateVersionColors = (versionId: number, colorIds: number[]) =>
  POST(`${API.admin.versions}/${versionId}/colors`, { color_ids: colorIds });

export const removeVersionColor = (versionId: number, colorId: number) =>
  apiClient.delete(`${API.admin.versions}/${versionId}/colors/${colorId}`);

/* ===================== PUBLIC LOOKUPS ===================== */

// Makes
export const getPublicMakes = (): Promise<Make[]> => {
  return GET<any>("/makes").then((res) => {
    const makes = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    
    // Convert logo paths to full URLs
    return makes.map((make: Make) => ({
      ...make,
      logo: make.logo 
        ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${make.logo}`
        : undefined
    }));
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

// Colors
export const getPublicColors = (): Promise<{ id: number; name: string; hex_code: string }[]> =>
  GET("/colors");

// Provinces (optional)
export const getPublicProvinces = (): Promise<Province[]> =>
  GET("/provinces");

export const getPublicFeatures = (): Promise<Feature[]> =>
  GET("/features");


