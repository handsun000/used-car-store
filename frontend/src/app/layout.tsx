import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.gencar.co.kr'),
  title: {
    default: '젠카 | 100% 실매물 정직한 중고차 by 손승진 대표',
    template: '%s | 젠카 (GenCar)',
  },
  description: '허위매물 없는 부산 사상중고차의 기준, 젠카(GenCar). 손승진 대표가 직접 검증한 100% 실매물만 정직하게 판매합니다.',
  openGraph: {
    title: '젠카 | 100% 실매물 정직한 중고차 by 손승진 대표',
    description: '허위매물 없는 부산 사상중고차의 기준, 젠카(GenCar). 손승진 대표가 직접 검증한 100% 실매물만 정직하게 판매합니다.',
    url: 'https://www.gencar.co.kr',
    siteName: 'GenCar (젠카)',
    locale: 'ko_KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'Fa6vTSwNbyVdkBP0Bobgw0dHrlejCjh_52U6rneTaYw',
    other: {
      'naver-site-verification': 'da7f4d9b1ce70186c48514fa00a92710bde97dee',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      {/* Force light mode styles: bg-white for background, text-gray-900 for text */}
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-gray-900`}>
        <Header />

        {/* Main Content with smart padding */}
        <PageContainer>
          {children}
        </PageContainer>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white text-lg font-bold mb-4">GenCar (젠카)</h3>
                <p className="text-sm mb-4">
                  허위매물 없는 부산 사상중고차의 기준.<br />
                  손승진 대표가 직접 검증한 100% 실매물만 취급합니다.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>대표: 손승진</p>
                  <p>위치: 부산 사상중고차 매매단지 내 젠카</p>
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">서비스</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/cars" className="hover:text-white">차량 검색</Link></li>
                  <li><Link href="/sell" className="hover:text-white">내차 팔기</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">고객지원</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/faq" className="hover:text-white">자주 묻는 질문</Link></li>
                  <li><Link href="/contact" className="hover:text-white">1:1 문의</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
              &copy; {new Date().getFullYear()} GenCar (젠카). All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
