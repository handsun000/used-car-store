import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MyCar Market',
  description: 'Premium Used Car Marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
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
                <h3 className="text-white text-lg font-bold mb-4">MyCar Market</h3>
                <p className="text-sm">
                  신뢰할 수 있는 중고차 거래의 시작.<br />
                  투명한 가격과 믿을 수 있는 품질을 약속합니다.
                </p>
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
              &copy; {new Date().getFullYear()} MyCar Market. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

