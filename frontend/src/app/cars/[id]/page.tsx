import { Metadata, ResolvingMetadata } from 'next';
import { getCarDetail } from '@/lib/api/cars';
import CarDetailClient from './CarDetailClient';

type Props = {
    params: Promise<{ id: string }> | { id: string }
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // resolve params promise safely for next.js latest requirements
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    try {
        const car = await getCarDetail(Number(id));
        return generateMetaFromCar(car, id);
    } catch (error) {
        return {
            title: '차량을 찾을 수 없습니다 | 젠카 (GenCar)',
            description: '요청하신 차량 정보를 찾을 수 없거나 삭제되었습니다.',
        };
    }
}

function generateMetaFromCar(car: any, id: string): Metadata {
    const title = `${car.brand} ${car.modelName} 실매물 중고차 | 젠카 (GenCar)`;
    const description = `손승진 대표가 보증하는 100% 실매물! ${car.productionYear}년식 ${car.brand} ${car.modelName}. 가격: ${car.price}만원. 주행거리: ${car.mileage.toLocaleString()}km. 무사고 여부: ${car.accidentHistory ? '사고 이력 있음' : '무사고'}. 안전하게 구매하세요.`;
    const images = car.images && car.images.length > 0 ? [car.images[0]] : [];
    const canonicalUrl = `https://gencar.co.kr/cars/${id}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'GenCar (젠카)',
            images: images,
            locale: 'ko_KR',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: images,
        },
    };
}

export default async function CarDetailPage({ params }: Props) {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    let car;
    try {
        car = await getCarDetail(Number(id));
    } catch (error) {
        // Fallback for API errors in server component
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-600">
                <h1 className="text-2xl font-bold mb-4">차량을 불러올 수 없습니다.</h1>
                <p>해당 매물이 삭제되었거나 네트워크 오류가 발생했습니다.</p>
                <a href="/buy" className="mt-8 text-blue-600 underline font-semibold hover:text-blue-500">다른 매물 둘러보기</a>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-600">
                <h1 className="text-2xl font-bold mb-4">차량 정보가 없습니다.</h1>
                <a href="/buy" className="mt-8 text-blue-600 underline font-semibold hover:text-blue-500">다른 매물 둘러보기</a>
            </div>
        )
    }

    // Pass the server-fetched data to the client component for interactivity
    return <CarDetailClient car={car} />;
}
