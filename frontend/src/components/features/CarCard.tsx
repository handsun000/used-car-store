import { Car } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface CarCardProps {
    car: Car;
}

export default function CarCard({ car }: CarCardProps) {
    // Format price to Korean Won format (e.g. 3,500만원)
    const formatPrice = (price: number) => {
        if (price >= 10000) {
            const eok = Math.floor(price / 10000);
            const man = price % 10000;
            return `${eok}억 ${man > 0 ? man.toLocaleString() : ''}만원`;
        }
        return `${price.toLocaleString()}만원`;
    };

    return (
        <Link href={`/cars/${car.id}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden">
            <div className="relative h-48 w-full bg-gray-200">
                {car.images.length > 0 ? (
                    // Note: In real app, use next/image with configured remotePatterns. 
                    // For now, using standard img tag if domain not configured or placeholder
                    <img src={car.images[0]} alt={car.modelName} className="object-cover w-full h-full group-hover:scale-105 transition duration-500" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                        No Image
                    </div>
                )}
                {car.status !== 'FOR_SALE' && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {car.status === 'SOLD' ? '판매완료' : '예약중'}
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs font-semibold text-blue-600 mb-1 block">{car.brand}</span>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition">{car.modelName}</h3>
                    </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3 space-x-2">
                    <span>{car.productionYear}년</span>
                    <span>•</span>
                    <span>{car.mileage.toLocaleString()}km</span>
                    <span>•</span>
                    <span>{car.fuelType}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-xl font-bold text-gray-900">{formatPrice(car.price)}</span>
                    <span className="text-xs text-gray-400">
                        {car.accidentHistory ? '사고있음' : '무사고'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
