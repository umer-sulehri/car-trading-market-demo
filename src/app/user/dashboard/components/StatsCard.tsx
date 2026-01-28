import React from "react";

interface Props {
  title: string;
  value: string;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}

export default function StatsCard({ 
  title, 
  value,
  icon,
  bgColor = "bg-white",
  textColor = "text-gray-800"
}: Props) {
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <h3 className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</h3>
        </div>
        {icon && (
          <div className={`${textColor} opacity-80`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
