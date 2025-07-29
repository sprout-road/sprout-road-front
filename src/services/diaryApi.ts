import { API_COMMON_URL } from "../constants/constants"

type DiaryContent = {
    id: string
    type: string
    order: number
    content: string
}

interface diaryApiRequest {
    title: string
    sigunguCode: number
    travelAt: string
    contents: DiaryContent
}

class diaryApi {
    static async getDiaryDetail(id: number | undefined) {
        try {
            if (id === undefined) {
                console.error("유효하지 않은 id 입니다.")
            }

            const response = await fetch(`${API_COMMON_URL}/api/travel-logs/${id}`);
            
            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "알 수 없는 오류가 발생!");
        }
    }

    static async writeDiary(diaryData: DiaryContent) {
        try {
            const response = await fetch(`${API_COMMON_URL}/api/travel-logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(diaryData)
            });
            
            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            return result;
            
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "알 수 없는 오류 발생!");
        }
    }
}