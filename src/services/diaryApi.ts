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

export interface Diary {
    id: number
    traveledAt: string
    title: string
}

export class diaryApi {
    static async getDiaryList(sigunguCode: string) {
        try {
            const response = await fetch(`${API_COMMON_URL}/api/travel-logs/${sigunguCode}`)

            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }

            return await response.json()

        } catch (error) {
            return [
                {
                    id: 1,
                    traveledAt: "25년 06월 15일", 
                    title: "단양 스카이워크" 
                },
                {
                    id: 2,
                    traveledAt: "25년 06월 16일",
                    title: "단양 시장",
                },
                {
                    id: 3,
                    traveledAt: "25년 06월 17일",
                    title: "사인암",
                },
                {
                    id: 4,
                    traveledAt: "25년 6월 23일",
                    title: "도담삼봉",
                },
            ] satisfies Diary[]
            // throw new Error(error instanceof Error ? error.message : "알 수 없는 오류가 발생하였습니다.")
        }
    }

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
            // api 연동 시 주석 해제
            // throw new Error(error instanceof Error ? error.message : "알 수 없는 오류가 발생!");
            return {
                title: "제목",
                visitedAt: "25년07월17일",
                contents: [
                    {
                        id: "block-1",
                        order: 1,
                        content: { 
                            type: "text",
                            text: "안녕하세요" 
                        }
                    },
                    {
                        id: "block-2", 
                        order: 2,
                        content: { 
                            type: "image",
                            url: "/logo.png",
                            caption: "이거는 로고입니다.", 
                        }
                    }
                ]
            }
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
            // api 연동 시 주석 해제
            // throw new Error(error instanceof Error ? error.message : "알 수 없는 오류 발생!");
        }
    }
}