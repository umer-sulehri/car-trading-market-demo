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
    // admin versions list
    versions: "/admin/versions",
    // admin sell cars list
    sellCars: "/admin/sell-cars",
    // admin users list
    users: "/admin/users",
  
    makes: "/admin/makes",
    models: "/admin/models",
    features: "/admin/features",
    specifications: "/admin/specifications",
    cities: "/admin/cities",
    colors: "/admin/colors",
    bodyTypes: "/admin/body-types",
   // new lookups
    engineTypes: "/engine-types",
    transmissions: "/transmissions",

    featureTypes: "/feature-types",
    specificationTypes: "/specification-types",

    newCarMedia: "/new-car-media",

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
