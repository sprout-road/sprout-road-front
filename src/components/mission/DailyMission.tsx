import { FaLock, FaUnlock } from "react-icons/fa"

export type Status = "OPEN" | "LOCK" | "PENDING" | "CLEAR"

interface DailyMissionProps {
    status: Status
}

function DailyMission({ status }: DailyMissionProps) {
    
    const baseClasses = "flex flex-row my-4 mx-8"
    
    const statusClasses = {
        LOCK: "p-6 bg-gray-200 cursor-default",
        PENDING: "p-6 bg-gray-200 border-2 border-gray-200 animate-pulse",
        OPEN: "py-3 px-4 bg-yellow-200 rounded-[20px]",
        CLEAR: ""
    }

    const getStatusClasses = (status: Status): string => {
        return `${baseClasses} ${statusClasses[status]}`
    }

    if (status === "CLEAR") {
        return null
    }

    return (
        <div className={getStatusClasses(status)}>
            {status === 'LOCK' && (
                <div className="flex items-center gap-2">
                    <FaLock size={16}/>
                    <span>이전 단계 완료시 잠금이 풀려요!</span>
                </div>
            )}
            {status === 'PENDING' && (
                <div className="flex items-center gap-2">
                    <FaUnlock size={16}/>
                    <span>내일이 되면 미션이 열려요!</span>
                </div>
            )}
            {status === 'OPEN' && (
                <div className="flex-1 text-center">
                    <p className="font-bold text-lg">오늘의 미션</p>
                </div>
            )}
        </div>
    )
}

export default DailyMission