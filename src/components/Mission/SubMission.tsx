import {useState} from "react";
import {IoRefreshCircle} from "react-icons/io5";
import {missionApi} from "../../services/missionApi";
import {MissionSubmitBody} from "../../types/missionTypes";
import {useLocationContext} from "../../contexts/LocationContext";
import LoadingSpinner from "../LoadingSpinner";
import ErrorComponent from "../common/Error";
import TextMissionContent from "./TextMissionContent.tsx";
import ImageMissionContent from "./ImageMissionContent.tsx";

interface SubMissionProps {
    children: React.ReactNode
    id: number
    type: string
    isComplete: boolean
    onToggleComplete: () => void
    handleRefreshClick: (id: number, code: string) => void
}

function SubMission({ children, id, type, isComplete, onToggleComplete, handleRefreshClick }: SubMissionProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [text, setText] = useState<string>('')
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
    const { currentLocation: regionData, isLocationLoading } = useLocationContext()

    const handleMissionClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsOpen(prev => !prev)
    }

    const handleMissionComplete = async (missionId: number, regionCode: string, body: MissionSubmitBody) => {
        if (type === "writing" && text.length < 20) {
            alert("최소 20자 이상 작성해주세요.");
            return;
        }
        
        if (type !== "writing" && !uploadedImageUrl) {
            alert("이미지를 업로드해주세요.");
            return;
        }

        onToggleComplete();
        setIsOpen(false)
        const result = await missionApi.submitMission(missionId, regionCode, body)
        return result
    }

    const isCompleteDisabled = () => {
        if (isComplete) return true;
        if (type === "writing") return text.length < 20;
        return !uploadedImageUrl;
    }

    const formatSubmitBody = (type: string, text: string, url: string | null): MissionSubmitBody => {
        const body = {
            type: type,
            submissionContent: type === "writing" ? text : (url || "")
        }

        return body
    }

    if (isLocationLoading) return <LoadingSpinner message="위치 정보 불러오는 중" />
    if (regionData === null) return <ErrorComponent error="지역 정보를 찾을 수 없습니다" />

    const regionCode = regionData.regionCode 

    return (
        <div className="flex flex-col border-y-2 p-4">
            <div  
                className={`
                    relative flex flex-row items-center
                    ${isComplete ? 'opacity-60' : ''}
                `}
            >
                <div 
                    className="flex flex-1 items-center justify-between"
                    onClick={(e) => handleMissionClick(e)}
                >
                    <span>{children}</span>
                    <div className="ml-4">
                        <IoRefreshCircle 
                            size={28} 
                            color="gray" 
                            onClick={() => handleRefreshClick(id, regionData.regionCode)}
                        />
                    </div>
            </div>
                {isComplete && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-red-600 text-lg font-bold opacity-90 rotate-12">
                            COMPLETE
                        </span>
                    </div>
                )}
            </div>
            
            {isOpen && (
                <div className="flex flex-col justify-center p-4">
                    {type === "writing" ? (
                        <TextMissionContent 
                            text={text}
                            setText={setText}
                        />
                    ) : (
                        <ImageMissionContent 
                            uploadedImageUrl={uploadedImageUrl}
                            setUploadedImageUrl={setUploadedImageUrl}
                        />
                    )}
                    
                    <div className="flex justify-center">
                        <button 
                            type="button" 
                            onClick={() => handleMissionComplete(id, regionCode, formatSubmitBody(type, text, uploadedImageUrl))}
                            disabled={isCompleteDisabled()}
                            className={`
                                px-4 py-2 w-80 rounded-[40px] font-bold
                                ${type === "text" ? "mt-2" : "mt-8"}
                                ${isCompleteDisabled() 
                                    ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
                                    : "bg-lime-400 text-white hover:bg-lime-500"}
                            `}
                        >
                            미션 완료하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SubMission;