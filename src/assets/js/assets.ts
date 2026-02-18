// src/assets/js/assets.ts
import { StaticImageData } from "next/image";

// Images
import search_icon from "../images/search_icon.svg";
import logo from "../images/kaar4u-logo.png";
import main_car from "../images/main_car.png";
import car from "../images/car.png";
import car1 from "../images/car1.png";
import car2 from "../images/car2.png";
import car3 from "../images/car3.png";
import car_mode from "../images/car_mode.png";
import arrow_icon from "../images/arrow_icon.svg";
import client1 from "../images/client1.jpg";
import client2 from "../images/client2.jpg";
import star from "../images/star.png";
import insta from "../images/insta.png";
import twitter from "../images/twitter.png";
import facebook from "../images/facebook.png";
import email from "../images/email.png";

// Dropdown & filter data
export const cityList: string[] = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
];

export const carModels: string[] = [
  "Toyota Corolla",
  "Honda Civic",
  "Toyota Fortuner",
  "Suzuki Alto",
  "KIA Sportage",
  "Hyundai Tucson",
];

export const priceRanges: string[] = [
  "PKR 500k - 1000k",
  "PKR 1000k - 2000k",
  "PKR 2000k - 3000k",
];

// Assets object
export const assets = {
  search_icon,
  logo,
  main_car,
  car,
  car1,
  car2,
  car3,
  car_mode,
  arrow_icon,
  client1,
  client2,
  star,
  insta,
  email,
  facebook,
  twitter,
};

// Menu links
export const menuLinks = [
  { name: "Home", path: "/" },
  { name: "Browse Cars", path: "/all-cars" },
  { name: "New Cars", path: "/new-cars" },
  { name: "Sell Your Car", path: "/sell-car" },

];

export const ownerMenuLinks = [
  {
    name: "Dashboard",
    path: "/owner",
  },
];

// Cars data type
export interface CarData {
  id: number;
  name: string;
  type: string;
  seats: string;
  fuel: string;
  trans: string;
  location: string;
  price: string;
  model: string;
  img: StaticImageData;
}

// Dummy cars data
export const carsData: CarData[] = [
  {
    id: 1,
    name: "Toyota Corolla",
    type: "Sedan",
    seats: "5 Seats",
    fuel: "Petrol",
    trans: "Automatic",
    location: "Karachi",
    price: "PKR 500k - 1000k",
    model: "Toyota Corolla",
    img: assets.car1,
  },
  {
    id: 2,
    name: "Honda Civic",
    type: "Sedan",
    seats: "5 Seats",
    fuel: "Petrol",
    trans: "Manual",
    location: "Lahore",
    price: "PKR 1000k - 2000k",
    model: "Honda Civic",
    img: assets.car2,
  },
  {
    id: 3,
    name: "Toyota Fortuner",
    type: "SUV",
    seats: "7 Seats",
    fuel: "Diesel",
    trans: "Automatic",
    location: "Islamabad",
    price: "PKR 2000k - 3000k",
    model: "Toyota Fortuner",
    img: assets.car3,
  },
  {
    id: 4,
    name: "Suzuki Alto",
    type: "Hatchback",
    seats: "4 Seats",
    fuel: "Petrol",
    trans: "Manual",
    location: "Rawalpindi",
    price: "PKR 500k - 1000k",
    model: "Suzuki Alto",
    img: assets.car1,
  },
  {
    id: 5,
    name: "KIA Sportage",
    type: "SUV",
    seats: "5 Seats",
    fuel: "Petrol",
    trans: "Automatic",
    location: "Faisalabad",
    price: "PKR 1000k - 2000k",
    model: "KIA Sportage",
    img: assets.car2,
  },
  {
    id: 6,
    name: "Hyundai Tucson",
    type: "SUV",
    seats: "5 Seats",
    fuel: "Diesel",
    trans: "Automatic",
    location: "Multan",
    price: "PKR 2000k - 3000k",
    model: "Hyundai Tucson",
    img: assets.car3,
  },
  {
    id: 7,
    name: "Honda Civic",
    type: "Sedan",
    seats: "5 Seats",
    fuel: "Petrol",
    trans: "Automatic",
    location: "Peshawar",
    price: "PKR 500k - 1000k",
    model: "Honda Civic",
    img: assets.car1,
  },
  {
    id: 8,
    name: "Toyota Corolla",
    type: "Sedan",
    seats: "5 Seats",
    fuel: "Petrol",
    trans: "Automatic",
    location: "Quetta",
    price: "PKR 1000k - 2000k",
    model: "Toyota Corolla",
    img: assets.car3,
  },
];



// ================= ADMIN DASHBOARD DATA =================

export interface BookingData {
  id: number;
  car: string;
  date: string;
  price: number;
  status: "Confirmed" | "Completed" | "Pending";
}

export const adminStats = {
  totalCars: carsData.length,
  totalBookings: 4,
  pendingBookings: 1,
  completedBookings: 1,
  monthlyRevenue: 1060,
};

export const recentBookings: BookingData[] = [
  {
    id: 1,
    car: "BMW 3 Series",
    date: "4/1/2025",
    price: 475,
    status: "Confirmed",
  },
  {
    id: 2,
    car: "Ford Explorer",
    date: "3/1/2025",
    price: 425,
    status: "Completed",
  },
  {
    id: 3,
    car: "Toyota Corolla",
    date: "4/5/2025",
    price: 225,
    status: "Pending",
  },
  {
    id: 4,
    car: "Tesla Model 3",
    date: "4/6/2025",
    price: 360,
    status: "Confirmed",
  },
];
