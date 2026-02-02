export const API = {
  auth: {
    login: "/login",
    signup: "/signup",
    logout: "/logout",
    refresh: "/auth/refresh",
  },
  user: {
    // user profile view / edit
    profile: "/user",
  },
  cars: {
    // user  create 
    create: "/cars",
    // user dashboard car list view
    myCars: "/my-cars",

    // user dashboard view / edit
    byId: (id: number) => `/cars/${id}`, 
    // user dashboard edit
    update: (id: number) => `/cars/${id}`,
    // user dashboarddelete
    delete: (id: number) => `/cars/${id}`,

    //  public single car view
    publicById: (id: number) => `/public/cars/${id}`, 
  },
  admin: {
    //admin carr view / manage of all users
    cars: "/admin/cars",
    // admin update car status approve/reject
    updateCarStatus: (id: number) => `/admin/cars/${id}/status`,
  
    makes: "/admin/makes",
    models: "/admin/models",
    versions: "/admin/versions",
    features: "/admin/features",
    specifications: "/admin/specifications", // NEW
    cities: "/admin/cities",
    colors: "/admin/colors",
   // new lookups
    engineTypes: "/engine-types",
    transmissions: "/transmissions",

    featureTypes: "/feature-types",             // optional, can be fetched from FeatureController
    specificationTypes: "/specification-types"  // optional, can be fetched from CarSpecificationController

  },

    /* ===================== SELL CARS ===================== */
  sellCars: {
    list: "/sell-cars",                // public list
    create: "/sell-cars",              // user create
    byId: (id: number) => `/sell-cars/${id}`,
    update: (id: number) => `/sell-cars/${id}`,
    delete: (id: number) => `/sell-cars/${id}`,
  },

  sellCarMedia: {
    create: "/sell-car-media",
    delete: (id: number) => `/sell-car-media/${id}`,
  },

  

};
