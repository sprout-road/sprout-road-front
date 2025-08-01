const API_COMMON_BASE_URL = 'https://api.deepdivers.store' 

const mocking = true

export class userApi {
    static async getUserInfo() {
        if (mocking) {
            return {
                id: 1,
                nickname: "새싹이"
            }
        } 

        try {
            const response = await fetch(`${API_COMMON_BASE_URL}/user`);

            if (!response.ok) {
                throw new Error(`서버 오류 : ${response.status} ${response.statusText}`)
            }

            return await response.json()
        } catch(error) {
            throw new Error(error instanceof Error ? error.message : "알 수 없는 오류 발생")
        }
    }

    static async loginUser() {
        if (mocking) {
            return {
                success: true,
                message: '임시 데이터로 로그인',
                user: {
                    id: 1,
                    nickname: "새싹이"
                },
            };    
        }

        try {
            const response = await fetch(`${API_COMMON_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: 1,
                    nickname: "새싹이"
                })
            });

            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "알 수 없는 오류 발생");
        } 
    }
}