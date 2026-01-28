"use client";

interface BookingItemProps {
  car: string;
  date: string;
  price: number;
  status: "Confirmed" | "Completed" | "Pending";
}

const BookingItem: React.FC<BookingItemProps> = ({
  car,
  date,
  price,
  status,
}) => {
  const statusStyles = {
    Confirmed: "bg-blue-100 text-blue-600",
    Completed: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="flex items-center justify-between border-b py-2 text-sm">
      <div>
        <p className="font-medium text-gray-800">{car}</p>
        <p className="text-gray-500">{date}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-700">${price}</span>
        <span
          className={`px-2 py-1 rounded text-xs ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

export default BookingItem;
