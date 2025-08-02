import { useEffect, useState } from "react"
import { MissionsInfo } from "../types/missionTypes"
import { missionApi } from "../services/missionApi"

export const useGetMissions = (regionCode: string) => {
    const [data, setData] = useState<MissionsInfo>({
        remainingRefreshCount: 0,
        userMissions: [],
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const fetchData = async() => {
        setLoading(true)
        setError('')

        try {
            const result = await missionApi.getMission(regionCode)
            setData(result)
        } catch (error) {
            setError(error instanceof Error ? error.message : "데이터를 불러오는 데 실패하였습니다");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (regionCode) fetchData()
    }, [regionCode])

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    }
}