import { BsPlusCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDiaryList } from "../../hook/useDiaryList";
import LoadingSpinner from "../LoadingSpinner";
import ErrorComponent from "../common/Error";

const user = {
    name: "새싹이"
}

interface TravelLogSectionProps {
    sigunguCode: string;
    region: string;
}

function TravelLogSection({ sigunguCode, region }: TravelLogSectionProps) {
    const navigate = useNavigate();

    // 지역이 선택되지 않은 경우 (빈 문자열이거나 기본 메시지인 경우)
    const isRegionSelected = sigunguCode && sigunguCode.trim() !== '' && region !== '지역을 선택해주세요';

    // Hook은 항상 호출 (조건부 호출 금지!)
    // 지역이 선택되지 않았을 때는 빈 문자열을 전달하여 API 호출 방지
    const { data: diaryList, loading, error, refetch } = useDiaryList(isRegionSelected ? sigunguCode : '');

    // 지역이 선택되지 않았을 때는 선택 안내 메시지만 표시
    if (!isRegionSelected) {
        return (
            <div
                className="w-full h-full flex items-center justify-center rounded-lg border border-gray-200"
                style={{ backgroundColor: '#C9E7CA' }}
            >
                <div className="text-center text-gray-600">
                    <div className="mb-2">
                        <svg
                            className="w-12 h-12 mx-auto text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"
                            />
                        </svg>
                    </div>
                    <p className="text-lg font-medium">지역을 선택해주세요</p>
                    <p className="text-sm text-gray-500 mt-1">
                        지도에서 원하는 시군구를 클릭하면<br />
                        해당 지역의 여행 기록을 볼 수 있어요
                    </p>
                </div>
            </div>
        );
    }

    const handleCreatePortfolio = () => {
        /* todo: 포트폴리오 버튼 만들기 클릭 이벤트 */
    };

    const handleAddDiary = () => {
        navigate('/create-diary')
    };

    const handleClickDiary = (id: number) => {
        navigate(`/travel-log/${id}`)
    };

    if (loading) {
        return (
            <div
                className="w-full h-full flex items-center justify-center rounded-lg border border-gray-200"
                style={{ backgroundColor: '#C9E7CA' }}
            >
                <LoadingSpinner message="여행 기록을 불러오는 중..." subMessage="잠시만 기다려주세요." />
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="w-full h-full flex items-center justify-center rounded-lg border border-gray-200"
                style={{ backgroundColor: '#C9E7CA' }}
            >
                <ErrorComponent error={error} refetch={refetch} />
            </div>
        );
    }

    return (
        <div
            className="w-full h-full p-4 rounded-lg border border-gray-200"
            style={{ backgroundColor: '#C9E7CA' }}
        >
            <div className="flex flex-col h-full text-gray-800">
                {/* 헤더 영역 */}
                <div className="flex flex-row items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">
                        {user.name}님의 {region} 기록일지
                    </h2>
                    <BsPlusCircle
                        size={25}
                        className="cursor-pointer hover:text-green-600 transition-colors"
                        onClick={handleAddDiary}
                        title="새 일기 작성"
                    />
                </div>

                {/* 일기 목록 영역 */}
                <div className="flex-1 overflow-y-auto scrollbar-hide mb-4">
                    {!diaryList || diaryList.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <p className="text-lg mb-2">아직 작성된 기록이 없어요</p>
                            <p className="text-sm">
                                위의 + 버튼을 눌러서<br />
                                첫 번째 여행 기록을 남겨보세요!
                            </p>
                        </div>
                    ) : (
                        diaryList.map((diary) => (
                            <div
                                key={diary.id}
                                className="pb-4 p-2 mb-2 bg-white/50 rounded-lg cursor-pointer hover:bg-white/70 transition-colors"
                                onClick={() => handleClickDiary(diary.id)}
                            >
                                <div className="font-bold text-md">{diary.title}</div>
                                <div className="text-sm text-gray-600 mt-1">{diary.traveledAt}</div>
                            </div>
                        ))
                    )}
                </div>

                {/* 포트폴리오 버튼 */}
                <button
                    onClick={handleCreatePortfolio}
                    className="w-full py-3 px-6 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                    disabled={!diaryList || diaryList.length === 0}
                >
                    디지털 포트폴리오 만들기
                    {(!diaryList || diaryList.length === 0) && (
                        <span className="text-xs block mt-1 opacity-75">
                            (기록이 있을 때 사용 가능)
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}

export default TravelLogSection;