import { useNavigate } from "react-router-dom"
import Header from "../../components/common/Header"
import SubMission from "../../components/Mission/SubMission"
import { useEffect, useMemo, useState } from "react"
import { MissionData, MissionsInfo } from "../../types/missionTypes"
import { missionApi } from "../../services/missionApi"
import { useLocationContext } from "../../contexts/LocationContext"
import LoadingSpinner from "../../components/LoadingSpinner"
import ErrorComponent from "../../components/common/Error"
import MissionCompleteModal from "../../components/Mission/MissionCompleteModal"

function Mission() {
    const [totalMissions, setTotalMissions] = useState<MissionsInfo | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [missionStatus, setMissionStatus] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const { currentLocation: currentRegionData, isLocationLoading, locationError } = useLocationContext()

    const navigate = useNavigate()

    // 모든 미션 완료 상태 확인
    const allMissionComplete = useMemo(() => {
        if (!totalMissions?.userMissions) return false
        return totalMissions.userMissions.every(mission => mission.completed)
    }, [totalMissions])

    // 모든 미션 완료 시 모달 자동 오픈
    useEffect(() => {
        if (allMissionComplete) {
            setIsModalOpen(true)
        }
    }, [allMissionComplete])

    const handleBackClick = () => {
        navigate('/main')
    }

    const handleStartMission = async (regionCode: string) => {
        try {
            setLoading(true)
            const result = await missionApi.startMission(regionCode)
            setMissionStatus(result)
            
            // 미션 시작 후 미션 리스트 조회
            if (result) {
                const missions = await missionApi.getMission(regionCode)
                setTotalMissions(missions)
            }
        } catch (error) {
            console.error('미션 시작 실패:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleComplete = (missionId: number) => {
        setTotalMissions(prev => {
            if (!prev) return null;

            return {
                ...prev,
                userMissions: prev.userMissions.map(mission => 
                    mission.id === missionId
                    ? { ...mission, completed: !mission.completed }
                    : mission
                )
            }
        })
        setIsModalOpen(true)
    }

    const handleRefreshClick = async (missionId: number, regionCode: string) => {
        try {
            // 남은 새로고침 횟수 확인
            if (totalMissions && totalMissions.remainingRefreshCount <= 0) {
                alert("새로고침 횟수를 모두 사용했습니다.");
                return;
            }

            setLoading(true); 
            
            const refreshResult = await missionApi.refreshMission(missionId, regionCode);
            
            const { remainingRefreshCount, userMissions } = refreshResult;
            
            setTotalMissions(prev => {
                if (!prev) return null;
                
                return {
                    ...prev,
                    remainingRefreshCount: remainingRefreshCount,
                    userMissions: prev.userMissions.map(mission => {
                        /* 새 미션 교체 */
                        const newMission = userMissions.find((newM: MissionData) => newM.id === mission.id);
                        return newMission ? newMission : mission;
                    })
                };
            });
            
            console.log('미션 새로고침 완료:', refreshResult);
            
        } catch (error) {
            console.error('미션 새로고침 실패:', error);
            alert("미션 새로고침에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializeMissions = async () => {
            console.log(currentRegionData?.regionCode);
            if (!currentRegionData?.regionCode) return;
            
            try {
                setLoading(true)
                
                const status = await missionApi.getMissionStatus(currentRegionData.regionCode)
                console.log('미션 상태:', status);
                setMissionStatus(status)
                
                if (status) {
                    const missions = await missionApi.getMission(currentRegionData.regionCode)
                    setTotalMissions(missions)
                } else {
                    setTotalMissions(null) 
                }
            } catch (error) {
                console.error('미션 초기화 실패:', error)
            } finally {
                setLoading(false)
            }
        }

        initializeMissions()
    }, [currentRegionData?.regionCode])

    const handleClose = () => {
        setIsModalOpen(false)
    }

    if (isLocationLoading || currentRegionData === undefined || loading === true) {
        return <LoadingSpinner message="필요한 정보를 가져오는 중입니다" />
    }

    if (locationError || currentRegionData === null) {
        return <ErrorComponent error={"필요한 정보를 가져오지 못했습니다"} />
    }

    const currentRegionCode = currentRegionData.regionCode

    return (
        <>
            {console.log("미션시작상태", missionStatus)}
            <Header isHome={false} onClick={handleBackClick}>미션</Header>
            <div className="flex flex-col p-4 mt-6">
                <div className="bg-lime-200 text-black font-bold text-center p-4 mb-20 rounded-[40px]">
                    오늘의 미션
                </div>
                <div className="relative">
                    {!missionStatus && (
                        <div className="absolute inset-0 bg-gray-200 bg-opacity-80 flex flex-col items-center justify-center z-10">
                            <button 
                                className="w-40 h-14 p-2 rounded-lg bg-green-500 text-white font-bold"
                                onClick={() => handleStartMission(currentRegionCode)}
                                disabled={loading}
                            >
                                {loading ? "시작 중..." : "미션 시작하기"}
                            </button>
                        </div>
                    )}
                    <div className={`${!missionStatus ? "blur-sm" : ""}`}>
                        {missionStatus && totalMissions?.userMissions ? (
                            totalMissions.userMissions.map((mission) => {
                                return (
                                    <SubMission
                                        key={mission.id}
                                        id={mission.id} 
                                        type={mission.type} 
                                        isComplete={mission.completed}
                                        onToggleComplete={() => handleToggleComplete(mission.id)}
                                        handleRefreshClick={handleRefreshClick}
                                    >
                                        {mission.description}
                                    </SubMission>
                                )
                            })
                        ) : (
                            <div className="space-y-4">
                                <div className="h-16 bg-gray-100 rounded border-y-2"></div>
                                <div className="h-16 bg-gray-100 rounded border-y-2"></div>
                                <div className="h-16 bg-gray-100 rounded border-y-2"></div>
                                <div className="h-16 bg-gray-100 rounded border-y-2"></div>
                                <div className="h-16 bg-gray-100 rounded border-y-2"></div>
                            </div>
                        )}
                    </div>
                    {isModalOpen && (
                        <MissionCompleteModal onClose={handleClose} />
                    )}
                </div>
            </div>
        </>
    )
}

export default Mission