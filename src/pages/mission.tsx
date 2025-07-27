import { useNavigate } from "react-router-dom"
import Header from "../components/common/Header"
import SubMission from "../components/mission/SubMission"
import { useEffect, useMemo, useState } from "react"
import DailyMission, { Status } from "../components/mission/DailyMission"

interface MissionData {
    id: number
    type: string
    description: string
    success: boolean
}

interface Totalmissions {
    last: Status
    second: Status
    first: Status
    missions: MissionData[]
}

function Mission() {
    const [totalMissions, setTotalMissions] = useState<Totalmissions | null>(null)

    const navigate = useNavigate()
    /* useEffect를 통해 api 스펙을 가진 더미데이터를 불러옴 */
    useEffect(() => {
        const fetchData = async() => {
            const apiResponse = {
                last: "LOCK" as Status,
                second: "PENDING" as Status,
                first: "OPEN" as Status,
                missions: [
                    {
                        id: 1,
                        type: "글",
                        description: '신세동 벽화마을 방문하고 느낀점 작성',
                        success: false
                    },
                    {
                        id: 2,
                        type: "사진",
                        description: '도산 서원 방문하고 사진 남기기',
                        success: false
                    },
                    {
                        id: 3,
                        type: "사진",
                        description: "안동 민속 박물관 방문하고 사진 찍기",
                        success: false
                    },
                    {
                        id: 4,
                        type: "글",
                        description: "하회 마을 전통 체험하고 느낀 점 남기기",
                        success: false
                    },
                ]
            }
            setTotalMissions(apiResponse)
        }

        fetchData()
    }, [])

    const handleBackClick = () => {
        navigate(-1)
    }

    const handleToggleComplete = (missionId: number) => {
        setTotalMissions(prev => {
            if (!prev) return null;

            return {
                ...prev,
                missions: prev.missions.map(mission => 
                    mission.id === missionId
                    ? { ...mission, success: !mission.success }
                    : mission
                )
            }
        })
    }

    const allMissionComplete = useMemo(() => {
        if (!totalMissions) return false
        return totalMissions.missions.every(mission => mission.success)
    }, [totalMissions])

    const handleMissionComplete = () => {
        if (allMissionComplete) {
            console.log("서버에 완료된 미션 데이터 전송")
        }
    }

    if (!totalMissions) {
        return <div>로딩 중...</div>
    }

    return (
        <>
            <Header isHome={false} onClick={handleBackClick}>미션</Header>
            <DailyMission status={totalMissions.last}/>
            <DailyMission status={totalMissions.second}/>
            <DailyMission status={totalMissions.first}/>
            <div className="flex flex-col p-4">
                {totalMissions.missions.map((mission) => {
                    return (
                        <SubMission
                            key={mission.id} 
                            id={mission.id} 
                            isComplete={mission.success}
                            onToggleComplete={handleToggleComplete}
                        >
                            {mission.description}
                        </SubMission>
                    )
                })}
                <div className="mt-8">
                    <button
                        onClick={handleMissionComplete}
                        disabled={!allMissionComplete}
                        className={`
                            w-full px-6 py-3 rounded-[8px] font-semibold transition-all
                            ${allMissionComplete
                                ? "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                                : "bg-gray-300 text-gray-500 cursor-default"
                            }
                        `}
                    >
                        {allMissionComplete ? "미션 완료하기" : "미션을 모두 완료해주세요"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default Mission 