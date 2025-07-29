import { BsPlusCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const user = {
    name: "새싹"
}

const region = {
    name: "단양"
}

const travels = [
    "25년 06월 15일 단양 스카이워크",
    "25년 06월 16일 단양 시장",
    "25년 06월 17일 사인암",
    "25년 06월 23일 도담삼봉",
]

function TravelLogSection() {
    const navigate = useNavigate();

    const handleCreatePortfolio = () => {
        /* todo: 포트 폴리오 버튼 만들기 클릭 이벤트 */
    };

    const handleAddDiary = () => {
        navigate('create-diary')
    };

    return (
        <div
            className="w-full h-full p-4 rounded-lg border border-gray-200"
            style={{ backgroundColor: '#C9E7CA' }}
        >
            {/* TODO: 트래블 로그 작성 및 목록 기능 구현 */}
            <div className="flex flex-col justify-center items-center text-gray-800 text-center mt-4">
                <div className="flex flex-row justify-content gap-4">
                    <h2 className="text-xl font-bold mb-6 px-6 pr-2">{user.name}님의 {region.name} 기록일지</h2>
                    <BsPlusCircle 
                        size={25} 
                        className="mt-0.5"
                        onClick={handleAddDiary}
                    />
                </div>
                <div>
                    {travels.map((travel) => {
                        return (
                            <div className="pb-6 font-bold text-md">{travel}</div>
                        )
                    })}
                    <div>
                        <button 
                            onClick={handleCreatePortfolio}
                            className="py-2 px-6 rounded-[8px] items-center justify-center text-white bg-green-600"
                        >
                            디지털 포트폴리오 만들기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TravelLogSection;