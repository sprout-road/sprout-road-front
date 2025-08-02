import { useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import TextMissionContent from "./TextMissionContent";
import ImageMissionContent from "./ImageMissionContent";
import { missionApi } from "../../services/missionApi";
import { MissionSubmitBody } from "../../types/missionTypes";
import { useLocationContext } from "../../contexts/LocationContext";
import LoadingSpinner from "../LoadingSpinner";
import ErrorComponent from "../common/Error";

interface SubMissionProps {
    children: React.ReactNode
    id: number
    type: string
    isComplete: boolean
    onToggleComplete: () => void
}

function SubMission({ children, id, type, isComplete, onToggleComplete }: SubMissionProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [text, setText] = useState<string>('')
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
    const { currentLocation: regionData, isLocationLoading } = useLocationContext()

    const handlePlusClick = () => {
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
        console.log(missionId, regionCode, body)
        const result = await missionApi.submitMission(missionId, regionCode, body)
        console.log(result)
        /* 모달 오픈 */
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
                    relative flex flex-row items-center justify-between
                    ${isComplete ? 'opacity-60' : ''}
                `}
            >
                <div className="flex items-center">
                    <span>{children}</span>
                    <div className="ml-2">
                        <BsFillPlusCircleFill 
                            size={16} 
                            color="gray" 
                            onClick={handlePlusClick}
                            className="cursor-pointer"
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