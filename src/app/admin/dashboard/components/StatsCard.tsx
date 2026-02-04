import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

export const StatsCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = "blue",
}) => {
  const colorStyles = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </h3>
        </div>

        <div className={`w-14 h-14 rounded-full ${colorStyles[color]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
