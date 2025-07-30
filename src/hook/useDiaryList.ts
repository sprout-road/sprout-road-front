import { useEffect, useState } from "react"
import { Diary, diaryApi } from "../services/diaryApi"

interface DiaryListReturn {
    data: Diary[] | null
    loading: boolean
    error: string
    refetch: () => void
}

export const useDiaryList = (sigunguCode: string): DiaryListReturn => {
    const [data, setData] = useState<Diary[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fetchData = async() => {
        setLoading(true);
        setError('');

        try {
            const result = await diaryApi.getDiaryList(sigunguCode);
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