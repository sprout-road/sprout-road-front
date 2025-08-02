import React, { useState, useEffect } from 'react';
import Header from "../components/common/Header";
import { useNavigate } from "react-router-dom";

interface UserRewardDto {
    regionName: string;
    regionCode: string;
    rewardCount: number;
    imageUrl: string;
}

interface UserRewardPageResponse {
    currentPage: number;
    totalPages: number;
    rewards: UserRewardDto[];
}

function Reward() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rewardData, setRewardData] = useState<UserRewardPageResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const navigateBack = () => {
        navigate('/main');
    };

    const fetchRewards = async (page: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://api.deepdivers.store/api/rewards/me?page=${page}`);
            if (!response.ok) {
                throw new Error('리워드 데이터를 불러오는데 실패했습니다.');
            }
            const data: UserRewardPageResponse = await response.json();
            setRewardData(data);
            setCurrentPage(page);
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRewards(1);
    }, []);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            fetchRewards(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (rewardData && currentPage < rewardData.totalPages) {
            fetchRewards(currentPage + 1);
        }
    };

    const RewardCard: React.FC<{ reward: UserRewardDto }> = ({ reward }) => (
        <div className="relative bg-gray-50 border border-gray-200 rounded-lg p-2 flex flex-col items-center min-h-0">
            {/* 리워드 이미지 영역 - flex로 크기 자동 조절 */}
            <div className="w-full flex-1 flex items-center justify-center mb-1 bg-white rounded overflow-hidden min-h-0">
                {reward.imageUrl ? (
                    <img
                        src={reward.imageUrl}
                        alt={`${reward.regionName} 리워드`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                                parent.innerHTML = '<span class="text-lg">🏆</span>';
                                parent.classList.add('flex', 'items-center', 'justify-center');
                            }
                        }}
                    />
                ) : (
                    <span className="text-lg">🏆</span>
                )}
            </div>

            {/* 지역명 - 고정 높이 */}
            <div className="flex-shrink-0 h-6 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-900 text-center leading-tight px-1">
                    {reward.regionName}
                </span>
            </div>

            {/* 리워드 카운트 뱃지 */}
            {reward.rewardCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-4 flex items-center justify-center px-1">
                    {reward.rewardCount > 99 ? '99+' : reward.rewardCount}
                </div>
            )}
        </div>
    );

    const PaginationControls: React.FC = () => (
        <div className="flex items-center justify-center gap-4">
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <span className="text-lg font-medium min-w-[50px] text-center">
                {rewardData ? `${currentPage}/${rewardData.totalPages}` : '1/1'}
            </span>

            <button
                onClick={handleNextPage}
                disabled={!rewardData || currentPage >= rewardData.totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white flex flex-col">
            <Header onClick={navigateBack}>리워드</Header>

            {/* Header를 제외한 나머지 공간 정확히 계산 */}
            <div className="flex-1 flex flex-col min-h-0">
                {loading && (
                    <div className="flex items-center justify-center flex-1">
                        <div className="text-gray-500">로딩 중...</div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center flex-1">
                        <div className="text-red-500 text-center">
                            <p>{error}</p>
                            <button
                                onClick={() => fetchRewards(currentPage)}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                다시 시도
                            </button>
                        </div>
                    </div>
                )}

                {!loading && !error && rewardData && (
                    <>
                        {/* 3x4 그리드 - viewport에서 Header와 페이지네이션 제외한 공간 */}
                        <div className="flex-1 p-3 min-h-0">
                            <div className="grid grid-cols-3 grid-rows-4 gap-2 h-full">
                                {rewardData.rewards.map((reward) => (
                                    <RewardCard
                                        key={`${reward.regionCode}-${reward.regionName}`}
                                        reward={reward}
                                    />
                                ))}

                                {/* 빈 슬롯 채우기 (12개 미만일 때) */}
                                {Array.from({ length: 12 - rewardData.rewards.length }).map((_, index) => (
                                    <div
                                        key={`empty-${index}`}
                                        className="bg-gray-50 border border-gray-200 rounded-lg p-2 opacity-30 flex flex-col items-center justify-center min-h-0"
                                    >
                                        <div className="flex-1 w-full bg-gray-200 rounded mb-1 min-h-0"></div>
                                        <div className="h-2 bg-gray-200 rounded w-6"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 페이지네이션 - 고정 높이 */}
                        <div className="flex-shrink-0 px-3 pb-3">
                            <PaginationControls />
                        </div>
                    </>
                )}

                {!loading && !error && rewardData && rewardData.rewards.length === 0 && (
                    <div className="flex items-center justify-center flex-1">
                        <div className="text-gray-500 text-center">
                            <p>아직 획득한 리워드가 없습니다.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reward;