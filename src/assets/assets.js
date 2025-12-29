import search_icon from "./search_icon.svg";
import logo from "./logo.svg";
import main_car from "./main_car.png";
import car from "./car.png";
import car1 from "./car1.png";
import car2 from "./car2.png";
import car3 from "./car3.png";
import arrow_icon from "./arrow_icon.svg";
import client1 from "./client1.jpg";
import client2 from "./client2.jpg";
import star from "./star.png";
import insta from "./insta.png";
import twitter from "./twitter.png";
import facebook from "./facebook.png";
import email from "./email.png";

export const cityList = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
];

export const carModels = [
  "Toyota Corolla",
  "Honda Civic",
  "Toyota Fortuner",
  "Suzuki Alto",
  "KIA Sportage",
  "Hyundai Tucson",
];

export const priceRanges = [
  "PKR 500k - 1000k",
  "PKR 1000k - 2000k",
  "PKR 2000k - 3000k",
];

export const assets = {
  search_icon,
  logo,
  main_car,
  car,
  car1,
  car2,
  car3,
  arrow_icon,
  client1,
  client2,
  star,
  insta,
  email,
  facebook,
  twitter,
};

export const menuLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
];

export const ownerMenuLinks = [
  {
    name: "Dashboard",
    path: "/owner",
  },
];

// Dummy data matching your dropdown options
export const carsData = [
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
