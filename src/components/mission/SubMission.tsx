import { ChangeEvent, useRef, useState } from "react";
import { BsCameraFill, BsFillPlusCircleFill } from "react-icons/bs";

interface SubMissionProps {
    children: React.ReactNode
    type: string
    isComplete: boolean
}

function SubMission({ children, type, isComplete }: SubMissionProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [text, setText] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePlusClick = () => {
        setIsOpen(prev => !prev) 
    }

    const handleAddPicture = () => {
        fileInputRef.current?.click();
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            /* todo: 업로드 처리 */
        }
    }

    const handleMissionComplete = () => {
        console.log('미션 완료')
    }

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
                        <BsFillPlusCircleFill size={16} color="gray" onClick={handlePlusClick}/>
                    </div>
                </div>
                {isComplete && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-red-600 text-lg font-bold opacity-30 rotate-12">
                        COMPLETE
                    </span>
                </div>
                )}
            </div>
            {isOpen && (
                <div className="flex flex-col justify-center p-4">
                    {
                        type === "text" ? (
                            <div className="flex flex-col">
                                <div className="border-2 border-black p-2 focus-within:outline-lime-400 focus-within:outline-2 focus-within:border-0">
                                    <textarea 
                                        placeholder="최소 20자의 글을 작성해주세요..."
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        maxLength={100}
                                        className="min-h-40 min-w-80 focus:outline-0"
                                    />
                                </div>
                                <span className="text-end">{text.length}자/{100}</span>
                            </div>
                        ) : (
                        <div 
                            className="flex flex-col justify-center rounded-lg w-75 bg-white border-2 p-10 h-40"
                            onClick={handleAddPicture}
                        >
                            <div className="flex justify-center p-2">
                                <BsCameraFill size={36} color="black" />
                            </div>
                            <p className="text-center pb-4 font-bold">사진을 첨부해주세요.</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />    
                        </div>
                    )}
                    <div className="flex justify-center">
                        <button 
                            type="button" 
                            onClick={handleMissionComplete}
                            disabled={isComplete}
                            className={`
                                px-4 py-2 w-80 rounded-[40px] font-bold 
                                ${type === text ? "mt-2" : "mt-8"}
                                ${isComplete ? "bg-gray-400 text-gray-600" : "bg-lime-400 text-white"}
                            `}
                        >
                            미션 완료하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SubMission