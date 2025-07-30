import { useEffect, useState } from "react"
import { diaryApi } from "../services/diaryApi"

interface DiaryDetailReturn {
    data: DiaryDetail | null
    loading: boolean
    error: string
    refetch: () => void
}

type DiaryContent = {
    type: "text" | "image"
    text?: string 
    url?: string
    caption?: string
}

export type DiaryContents = {
    id: string
    order: number
    content: DiaryContent
}

type DiaryDetail = {
    title: string
    visitedAt: string
    contents: DiaryContents[]
}

export const useDiaryDetail = (logId: number): DiaryDetailReturn => {
    const [data, setData] = useState<DiaryDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fetchData = async() => {
        setLoading(true);
        setError('');

        try {
            const result = await diaryApi.getDiaryDetail(logId);
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