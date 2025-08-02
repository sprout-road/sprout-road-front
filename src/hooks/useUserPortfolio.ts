import { useCallback, useEffect, useState } from "react";
import { portfolioApi } from "../services/portfolioApi";
import { PortfolioCount, UsePortfolioState } from "../types/portfolio";

export const useUserPortfolio = (
    userId: string | undefined,
    fromDateString: string | null,   
    toDateString: string | null, 
    regionCode: string | undefined
): UsePortfolioState => {
    const [data, setData] = useState<PortfolioCount | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // 초기값을 true로 설정
    const [error, setError] = useState<string | null>(null);

    const fetchPortfolio = useCallback(async () => {
        // 필요한 값들이 없으면 early return
        if (!userId || !fromDateString || !toDateString || !regionCode) {
            setLoading(false);
            return;
        }

        // 문자열을 Date로 변환
        const fromDate = new Date(fromDateString);
        const toDate = new Date(toDateString);

        // 날짜 유효성 검사
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            setError("유효하지 않은 날짜입니다.");
            setLoading(false);
            return;
        }

        // 날짜 순서 검사
        if (fromDate > toDate) {
            setError("시작 날짜가 종료 날짜보다 늦을 수 없습니다.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await portfolioApi.getCountPortfolio(userId, fromDate, toDate, regionCode);
            setData(result);
        } catch (err) {
            console.error('Portfolio fetch error:', err);
            setError(err instanceof Error ? err.message : "데이터를 가져오는데 실패했습니다.");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [userId, fromDateString, toDateString, regionCode]);

    useEffect(() => {
        fetchPortfolio();
    }, [fetchPortfolio]);

    return {
        data,
        loading,
        error,
        refetch: fetchPortfolio
    };
};