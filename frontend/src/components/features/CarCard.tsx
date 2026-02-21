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
        <Link href={`/cars/${car.id}`} className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden">
            <div className="relative h-48 w-full bg-slate-100">
                {car.images.length > 0 ? (
                    // Note: In real app, use next/image with configured remotePatterns. 
                    // For now, using standard img tag if domain not configured or placeholder
                    <img src={car.images[0]} alt={car.modelName} className="object-cover w-full h-full group-hover:scale-105 transition duration-500" />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 bg-slate-100">
                        No Image
                    </div>
                )}
                {car.status !== 'FOR_SALE' && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm tracking-wide">
                        {car.status === 'SOLD' ? '판매완료' : '예약중'}
                    </div>
                )}
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <span className="text-xs font-bold text-blue-600 mb-1 block uppercase tracking-wider">{car.brand}</span>
                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{car.modelName}</h3>
                    </div>
                </div>
                <div className="flex items-center text-sm text-slate-500 mb-4 space-x-2 font-medium">
                    <span>{car.productionYear}년</span>
                    <span className="text-slate-300">•</span>
                    <span>{car.mileage.toLocaleString()}km</span>
                    <span className="text-slate-300">•</span>
                    <span>{car.fuelType}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <span className="text-xl font-extrabold text-slate-900">{formatPrice(car.price)}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${car.accidentHistory ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
                        {car.accidentHistory ? '사고있음' : '무사고'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
