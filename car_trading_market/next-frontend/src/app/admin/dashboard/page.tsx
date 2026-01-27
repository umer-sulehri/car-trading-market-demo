"use client";

import {
  Car,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

// import Navbar from "@/components/Navbar";
import {StatsCard} from "@/src/app/admin/dashboard/components/StatsCard";
import BookingItem from "@/src/app/admin/dashboard/components/BookingItem";

const Dashboard: React.FC = () => {
  return (
    <>
  
      <div className="flex min-h-screen bg-gray-50">

        <div className="flex-1 flex flex-col max-w-[1200px] mx-auto">
          <main className="flex-1 p-4">
            {/* Header */}
            <div className="mb-5">
              <h1 className="text-lg font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-xs text-gray-500 max-w-xl">
                Monitor platform performance, bookings & revenue
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-8 items-stretch">
              <StatsCard title="Total Cars" value={8} icon={<Car />} />
              <StatsCard
                title="Total Bookings"
                value={8}
                icon={<ClipboardList />}
              />
              <StatsCard
                title="Pending Bookings"
                value={8}
                icon={<AlertTriangle />}
              />
              <StatsCard
                title="Completed Bookings"
                value={8}
                icon={<CheckCircle />}
              />
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2 bg-white p-3 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  Recent Bookings
                </h3>

                <BookingItem
                  car="BMW 3 Series"
                  date="4/1/2025"
                  price={475}
                  status="Confirmed"
                />
                <BookingItem
                  car="Ford Explorer"
                  date="3/1/2025"
                  price={425}
                  status="Completed"
                />
                <BookingItem
                  car="Toyota Corolla"
                  date="4/5/2025"
                  price={225}
                  status="Pending"
                />
                <BookingItem
                  car="Tesla Model 3"
                  date="4/6/2025"
                  price={360}
                  status="Confirmed"
                />
              </div>

              <div className="w-[80%] bg-white p-2 rounded-lg border border-gray-200 h-[150px] flex flex-col justify-center items-center">
                <h3 className="text-[20px] font-semibold text-gray-800">
                  Monthly Revenue
                </h3>
                <p className="text-[9px] text-gray-500">
                  Revenue for Current Month
                </p>

                <div className="text-xl font-bold text-blue-600 flex items-center gap-1 mt-1">
                  <DollarSign size={14} />
                  1060
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
