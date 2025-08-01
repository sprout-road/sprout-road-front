import { useNavigate } from "react-router-dom"
import Header from "../../components/common/Header"
import SubMission from "../../components/Mission/SubMission"
import { useEffect, useMemo, useState } from "react"
import { MissionData } from "../../types/missionTypes"

function Mission() {
    const [totalMissions, setTotalMissions] = useState<MissionData[] | null>(null)

    const navigate = useNavigate()
    /* useEffect를 통해 api 스펙을 가진 더미데이터를 불러옴 */
    useEffect(() => {
        const fetchData = async() => {
            const apiResponse = [
                {
                    id: 1,
                    type: "text",
                    description: '신세동 벽화마을 방문하고 느낀점 작성',
                    success: false
                },
                {
                    id: 2,
                    type: "image",
                    description: '도산 서원 방문하고 사진 남기기',
                    success: false
                },
                {
                    id: 3,
                    type: "text",
                    description: "안동 민속 박물관 방문하고 사진 찍기",
                    success: false
                },
                {
                    id: 4,
                    type: "text",
                    description: "하회 마을 전통 체험하고 느낀 점 남기기",
                    success: false
                },
            ]
            setTotalMissions(apiResponse)
        }

        fetchData()
    }, [])

    const handleBackClick = () => {
        navigate('/main')
    }

    const handleToggleComplete = (missionId: number) => {
        setTotalMissions(prev => {
            if (!prev) return null;

            return {
                ...prev,
                missions: prev.map(mission => 
                    mission.id === missionId
                    ? { ...mission, success: !mission.success }
                    : mission
                )
            }
        })
    }

    // const allMissionComplete = useMemo(() => {
    //     if (!totalMissions) return false
    //     return totalMissions.every(mission => mission.success)
    // }, [totalMissions])

    // const handleMissionComplete = () => {
    //     if (allMissionComplete) {
    //         console.log("서버에 완료된 미션 데이터 전송")
    //     }
    // }

    if (!totalMissions) {
        return <div>로딩 중...</div>
    }

    return (
        <>
            <Header isHome={false} onClick={handleBackClick}>미션</Header>
            <div className="flex flex-col p-4 mt-6">
                <div className="bg-lime-200 text-black font-bold text-center p-4 mb-20 rounded-[40px]">
                    오늘의 미션
                </div>
                {totalMissions.map((mission) => {
                    return (
                        <SubMission
                            key={mission.id} 
                            type={mission.type} 
                            isComplete={mission.success}
                        >
                            {mission.description}
                        </SubMission>
                    )
                })}
            </div>
        </>
    )
}

export default Mission 