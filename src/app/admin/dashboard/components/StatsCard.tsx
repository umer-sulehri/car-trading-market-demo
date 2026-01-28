import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

export const StatsCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between w-full h-full">
      <div>
        <p className="text-[14px] text-gray-500">{title}</p>
        <h3 className="text-xl font-semibold text-gray-800">
          {value}
        </h3>
      </div>

      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
};
