import { BsCheck2Square, BsFillPlusCircleFill, BsSquare } from "react-icons/bs";

interface SubMissionProps {
    children: React.ReactNode
    id: number
    isComplete: boolean
    onToggleComplete: (id: number) => void
}

function SubMission({ children, id, isComplete, onToggleComplete }: SubMissionProps) {

    const handlePlusClick = () => {
        // console.log('미션 상세 모달로 이동')
        // onToggleComplete(id)
        /* todo: 미션 모달로 이동 */ 
    }

    return (
        <div  
            className={`
                relative flex flex-row items-center justify-between border-y-2 p-4
                ${isComplete ? 'opacity-60' : ''}
            `}
        >
            <div className="flex items-center">
                <span>{children}</span>
                <div className="ml-2">
                    <BsFillPlusCircleFill size={16} color="gray" onClick={handlePlusClick}/>
                </div>
            </div>
            <div className="cursor-pointer">
                {isComplete ? (
                    <BsCheck2Square size={20} className="text-green-500" />
                ) : (
                    <BsSquare size={20} className="text-gray-400 hover:text-gray-600" />
                )}
            </div>
            {isComplete && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <span className="text-red-600 text-lg font-bold opacity-30 rotate-12">
                       COMPLETE
                   </span>
               </div>
           )}
        </div>
    )
}

export default SubMission