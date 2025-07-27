import {useNavigate} from 'react-router-dom';

interface HeaderProps {
    type: 'main' | 'detail';
    title?: string;
}

function Header({ type, title }: HeaderProps) {
    const navigate = useNavigate();

    if (type === 'main') {
        // 전체 지도 헤더: {홈, 검색, 삼단바}
        return (
            <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm">
                <div className="flex items-center justify-between px-4 py-4 h-16">
                    {/* 홈 버튼 */}
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="홈으로"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </button>

                    {/* 검색 버튼 */}
                    <button
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="검색"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    {/* 삼단바 (메뉴) */}
                    <button
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="메뉴"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    // 지역 상세 헤더: 완전히 다른 구조로 작성
    return (
        <div className="fixed top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm">
            <div className="flex items-center px-4 py-4 h-16">
                {/* 왼쪽: 뒤로가기 (고정 너비) */}
                <div className="w-32 flex justify-start">
                    <button
                        onClick={() => navigate('/region-coloring')}
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="전체 지도로 돌아가기"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* 중앙: travelLog (유동적) */}
                <div className="flex-1 flex justify-center">
                    <span className="text-lg font-semibold text-gray-800"> {title} </span>
                </div>

                {/* 오른쪽: 메뉴만 (고정 너비 - 왼쪽과 동일) */}
                <div className="w-32 flex justify-end items-center">
                    <button
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="메뉴"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;