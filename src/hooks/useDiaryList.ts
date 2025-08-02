import { useEffect, useState } from "react"
import { TravelLog, TravelLogApi } from "../services/TravelLogApi"

interface TravelLogListReturn {
    data: TravelLog[] | null
    loading: boolean
    error: string
    refetch: () => void
}

export const useDiaryList = (regionCode: string): TravelLogListReturn => {
    const [data, setData] = useState<TravelLog[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fetchData = async() => {
        setLoading(true);
        setError('');

        try {
            const result = await TravelLogApi.getTravelLogList(regionCode);
            setData(result);
        } catch (error) {
            setError(error instanceof Error ? error.message : "데이터를 불러오는 데 실패하였습니다");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (regionCode) {
            fetchData();
        }
    }, [regionCode]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
};