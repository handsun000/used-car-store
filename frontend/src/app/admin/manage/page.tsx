'use client';

import React, { useEffect, useState } from 'react';
import { fetchCars, updateCarStatus, deleteCar, updateCar } from '@/lib/api';
import { CarResponse, CarRequest, CarStatus } from '@/types';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import CarForm from '@/components/CarForm';

export default function AdminManagePage() {
    const [cars, setCars] = useState<CarResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<CarResponse | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingCarId, setDeletingCarId] = useState<number | null>(null);

    const loadCars = async () => {
        try {
            const data = await fetchCars();
            setCars(data);
        } catch (error) {
            console.error('Failed to load cars:', error);
            alert('매물 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCars();
    }, []);

    const handleStatusChange = async (car: CarResponse, newStatus: CarStatus) => {
        try {
            await updateCarStatus(car.id, newStatus);
            // Optimistic update
            setCars(prev => prev.map(c => c.id === car.id ? { ...c, status: newStatus } : c));
        } catch (error) {
            console.error('Status update failed:', error);
            alert('상태 변경에 실패했습니다.');
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeletingCarId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingCarId) return;
        try {
            await deleteCar(deletingCarId);
            setCars(prev => prev.filter(c => c.id !== deletingCarId));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    const handleEditClick = (car: CarResponse) => {
        setEditingCar(car);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (formData: CarRequest, images: File[]) => {
        if (!editingCar) return;
        setIsUpdating(true);
        try {
            // Convert to FormData
            const data = new FormData();
            data.append('carRequest', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
            images.forEach(image => {
                data.append('newImages', image); // Backend expects 'newImages' for updates or 'images' depending on Service. 
                // Service: public void update(Long id, CarRequest request, List<MultipartFile> newImages)
                // Controller: @RequestPart(value = "newImages", required = false) List<MultipartFile> newImages
                // So expected key is 'newImages'
            });

            await updateCar(editingCar.id, data);

            // Reload cars to show updates
            await loadCars();
            setIsEditModalOpen(false);
            setEditingCar(null);
            alert('수정이 완료되었습니다.');
        } catch (error) {
            console.error('Update failed:', error);
            alert('수정에 실패했습니다.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-white">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">매물 관리 (Admin Dashboard)</h1>
                <a href="/admin/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                    + 매물 등록
                </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="px-6 py-4 font-bold text-gray-700 text-sm uppercase tracking-wider">이미지</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-sm uppercase tracking-wider">정보 (Brand/Model)</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-sm uppercase tracking-wider">연식/주행거리</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-sm uppercase tracking-wider">가격</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-sm uppercase tracking-wider">상태 (Status)</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-sm uppercase tracking-wider text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {cars.map(car => (
                                <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-20 h-14 rounded-md overflow-hidden bg-gray-200">
                                            {car.images && car.images.length > 0 ? (
                                                <img src={car.images[0]} alt={car.modelName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{car.brand}</div>
                                        <div className="text-sm text-gray-600">{car.modelName}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div>{car.productionYear}년</div>
                                        <div>{car.mileage.toLocaleString()} km</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {car.price.toLocaleString()} 만원
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={car.status}
                                            onChange={(e) => handleStatusChange(car, e.target.value as any)}
                                            className={`block w-full pl-3 pr-10 py-2 text-xs font-bold border rounded-md sm:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${car.status === 'FOR_SALE' ? 'bg-green-100 text-green-800 border-green-200' :
                                                car.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                    'bg-red-100 text-red-800 border-red-200'
                                                }`}
                                        >
                                            <option value="FOR_SALE" className="bg-white text-gray-900">판매중</option>
                                            <option value="RESERVED" className="bg-white text-gray-900">예약중</option>
                                            <option value="SOLD" className="bg-white text-gray-900">판매완료</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleEditClick(car)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(car.id)}
                                            className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {cars.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        매물이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && editingCar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all duration-300">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-gray-900">매물 수정</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                                &times;
                            </button>
                        </div>
                        <div className="p-6">
                            <CarForm
                                initialData={{
                                    brand: editingCar.brand,
                                    modelName: editingCar.modelName,
                                    productionYear: editingCar.productionYear,
                                    mileage: editingCar.mileage,
                                    price: editingCar.price,
                                    fuelType: editingCar.fuelType,
                                    transmission: editingCar.transmission,
                                    accidentHistory: editingCar.accidentHistory,
                                    description: editingCar.description,
                                    imageUrls: editingCar.images
                                }}
                                onSubmit={handleEditSubmit}
                                isLoading={isUpdating}
                                buttonText="수정 완료"
                            />
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="매물 삭제"
                message="정말로 이 매물을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
            />
        </div>
    );
}
