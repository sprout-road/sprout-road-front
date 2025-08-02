import { API_COMMON_URL } from "../constants/constants";

export class portfolioApi {
    static async getCountPortfolio(userId:number, from: Date, to: Date, regionCode: string) {
        try {
            const formatingFrom = from.toISOString().split('T')[0]; 
            const formatingTo = to.toISOString().split('T')[0];     

            const response = await fetch(`${API_COMMON_URL}/api/portfolios/users/${userId}?from=${formatingFrom}&to=${formatingTo}&regionCode=${regionCode}`)

            if (!response.ok) {
                throw new Error(`서버 오류 : ${response.status} ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "예상치 못한 오류 발생!")
        }
    }
}

// http://deepdivers.store/portfolio/generate/users/{userId}?from={2025-06-15}&to=2025-07-14&regionCode={15210}

// http://deepdivers.store/portfolio/travel-logs/users/{userId}?from=2025-06-15&to=2025-07-14