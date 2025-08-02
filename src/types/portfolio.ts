export type PortfolioCount = {
    missionCount: number
    travelCount: number
}

export interface getCountPortfolioParams {
    userId: number
    from: Date
    to: Date
    regionCode: string
}

export interface UsePortfolioState {
    data: PortfolioCount | null,
    loading: boolean,
    error: string | null,
    refetch: () => void
}