import { BsPlusCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDiaryList } from "../../hook/useDiaryList";
import LoadingSpinner from "../LoadingSpinner";
import ErrorComponent from "../common/Error";

const user = {
    name: "새싹이"
}

interface TravelLogSectionProps {
    sigunguCode: string | undefined
    region: string | undefined
}

function TravelLogSection({sigunguCode, region}: TravelLogSectionProps) {

    if (sigunguCode === undefined) {
        return (
            <div className="text-center py-4">
                <p>여행 기록을 불러올 지역 코드가 없습니다.</p>
            </div>
        );
    }

    if (region === undefined) {
        region = "부산"
    }

    const navigate = useNavigate();
    const { data: diaryList, loading, error, refetch } = useDiaryList(sigunguCode)
    

    const handleCreatePortfolio = () => {
        /* todo: 포트 폴리오 버튼 만들기 클릭 이벤트 */
    };

    const handleAddDiary = () => {
        navigate('./create-diary')
    };

    const handleClickDiary = (id: number) => {
        navigate(`./diary/${id}`)
    };

    if (loading) {
        return (
            <LoadingSpinner message="로딩 중입니다..." subMessage="잠시만 기다려주세요." />
        )
    }

    if (error) {
        return (
            <ErrorComponent error={error} refetch={refetch} />
        )
    }

    return (
        <div
            className="w-full h-full p-4 rounded-lg border border-gray-200"
            style={{ backgroundColor: '#C9E7CA' }}
        >
            {/* TODO: 트래블 로그 작성 및 목록 기능 구현 */}
            <div className="flex flex-col justify-center items-center text-gray-800 text-center">
                <div className="flex flex-row justify-content gap-2">
                    <h2 className="text-xl font-bold mb-4 px-6 pr-2">{user.name}님의 {region} 기록일지</h2>
                    <BsPlusCircle 
                        size={25} 
                        className="mt-0.5"
                        onClick={handleAddDiary}
                    />
                </div>
                <div className="h-45 overflow-y-scroll scrollbar-hide">
                    {diaryList === null ? (
                        <div className="text-center">
                            <p>지역</p>
                        </div>    
                    ) : (
                        diaryList.map((diary) => {
                            return (
                                <div 
                                    key={diary.id} 
                                    className="pb-6 font-bold text-md"
                                    onClick={() => handleClickDiary(diary.id)}
                                >
                                    {diary.traveledAt} {diary.title}
                                </div>
                            )
                        })    
                    )}
                </div>
                <button 
                    onClick={handleCreatePortfolio}
                    className="mt-1 py-2 px-6 rounded-[8px] items-center justify-center text-white bg-green-600"
                >
                    디지털 포트폴리오 만들기
                </button>
            </div>
        </div>
    );
}

export default TravelLogSection;