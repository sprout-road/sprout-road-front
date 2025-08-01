import { useEffect, useState } from "react"
import { TravelLog, TravelLogApi } from "../services/TravelLogApi"

interface TravelLogListReturn {
    data: TravelLog[] | null
    loading: boolean
    error: string
    refetch: () => void
}

export const useDiaryList = (sigunguCode: string): TravelLogListReturn => {
    const [data, setData] = useState<TravelLog[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fetchData = async() => {
        setLoading(true);
        setError('');

        try {
            const result = await TravelLogApi.getTravelLogList();
            setData(result);
        } catch (error) {
            setError(error instanceof Error ? error.message : "데이터를 불러오는 데 실패하였습니다");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sigunguCode) {
            fetchData();
        }
    }, [sigunguCode]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
};