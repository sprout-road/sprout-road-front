import { useNavigate, useParams } from "react-router-dom";
import ErrorComponent from "../../components/common/Error"
import Header from "../../components/common/Header";
import LoadingSpinner from "../../components/LoadingSpinner"
import { useDiaryDetail } from "../../hooks/useDiaryDetail"

type Weather = "SUNNY" | "RAINY" | "SNOW" | "CLOUDY";

function TravelLogDetail() {
    const param = useParams();
    const logId = parseInt(param.diaryId!);
    const {data: diaryDetail, loading, error, refetch} = useDiaryDetail(logId);
    const navigate = useNavigate();

    const checkWeather = (weather: Weather) => {
        switch(weather) {
            case 'SUNNY':
                return '☀️';
            case 'RAINY':
                return '🌦️';
            case 'CLOUDY':
                return '☁️';
            case 'SNOW':
                return '❄️'
            default:
                return;                
        } 
    }

    const handleBackClick = () => {
        navigate('/main');
    }

    if (loading) {
        return (
            <LoadingSpinner message="로딩 중..." />
        )
    }

    if (error || diaryDetail === null) {
        return (    
            <ErrorComponent error={error} refetch={refetch}/>
        )
    }

    return (
        <div>
            <div className="flex">
                <Header onClick={handleBackClick}>트레블 로그</Header>
            </div>
            <div className="relative bg-lime-600 text-white font-bold mx-6 mt-4 rounded-[10px]">
                <div className="flex flex-col">
                    <p className="p-2">{diaryDetail.visitedAt}</p>
                    <p className="text-center pb-2 text-xl">{diaryDetail.title}</p>
                </div>
                <div className="absolute right-0 top-0 text-3xl">{checkWeather('SUNNY')}</div>
            </div>
            <div className="flex justify-end mx-6">
                <button className="py-4 text-md text-lime-600">수정하기</button>
            </div>
            <div className="mx-8 flex flex-col">
                {diaryDetail.contents.map((c) => {
                    return c.type === "text" ? (
                        <p className="p-2">{c.content.text}</p>
                    ) : (
                        <div
                            key={c.order}
                            className="flex flex-col"
                        >
                            <div className="flex justify-center">
                                <img src={c.content.url} className="w-60 h-60 mb-2 border-1 border-lime-400" />
                            </div>
                            <span>{c.content.caption}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default TravelLogDetail