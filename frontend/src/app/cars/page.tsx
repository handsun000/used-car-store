import { fetchCars } from '@/lib/api';
import CarCard from '@/components/features/CarCard';

// Opt out of static generation for simplicity in this demo (forces dynamic fetch)
export const dynamic = 'force-dynamic';

export default async function CarsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // In a real app, parse searchParams to CarSearchCondition
    const cars = await fetchCars();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">중고차 매물</h1>
                    <p className="text-gray-600">믿을 수 있는 인증 차량을 확인해보세요.</p>
                </div>
                <div className="flex space-x-2">
                    {/* Sort/Filter buttons dummy */}
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">최신순</button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">가격순</button>
                </div>
            </div>

            {cars.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">등록된 차량이 없습니다.</p>
                    <p className="text-gray-400">첫 번째 매물을 등록해보세요!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cars.map((car) => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>
            )}
        </div>
    );
}
