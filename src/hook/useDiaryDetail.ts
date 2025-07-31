import { useEffect, useState } from "react"
import { TravelLogDetail } from "../types/travelLogTypes"
import { TravelLogApi } from "../services/TravelLogApi"

interface DiaryDetailReturn {
    data: TravelLogDetail | null
    loading: boolean
    error: string
    refetch: () => void
}

export const useDiaryDetail = (logId: number): DiaryDetailReturn => {
    const [data, setData] = useState<TravelLogDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fetchData = async() => {
        setLoading(true);
        setError('');

        try {
            const result = await TravelLogApi.getTravelLogDetail(logId);
            setData(result);
        } catch (error) {
            setError(error instanceof Error ? error.message : "데이터를 불러오는 데 실패하였습니다");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (logId) {
            fetchData();
        }
    }, [logId]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    }
}