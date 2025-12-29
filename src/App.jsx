import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AllCars from "./pages/AllCars";
import CarDetails from "./pages/CarDetails.jsx";
import UserDashboard from "./pages/dashboard/Dashboard.jsx";

import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/all-cars" element={<AllCars />} />
          <Route path="/car-details/:id" element={<CarDetails />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute>
              <UserDashboard /> 
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
