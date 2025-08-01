import { API_COMMON_URL } from "../constants/constants";
import { MissionRefreshBody, MissionSubmitBody } from "../types/missionTypes";

class missionApi {
    static async getMissionStatus(regionCode: string) {
        try {
            const response = await fetch(`${API_COMMON_URL}/api/missions/regions/${regionCode}/status`)

            if (!response.ok) {
                throw new Error(`API 오류: ${response.status} ${response.statusText}`)
            }

            return await response.json()

        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.")
        }
    }

    static async getMission(regionCode: string) {
        try {
            const response = await fetch(`${API_COMMON_URL}/api/missions/regions/${regionCode}`)

            if (!response.ok) {
                throw new Error(`API 오류: ${response.status} ${response.statusText}`)
            }

            return await response.json()

        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.")
        }
    }

    static async missionImageUpload(imageFile: File) {
        try {
            if (imageFile === undefined || imageFile === null) {
                console.error("선택된 이미지 파일이 없습니다");
            }

            const formData = new FormData();
            formData.append('imageFile', imageFile);

            const response = await fetch(`${API_COMMON_URL}/api/images/upload`, {
                method: "POST",
                body: formData,
            })
        
            if (!response.ok) {
                throw new Error(`API 오류: ${response.status} ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.")
        }
    }

    static async startMission(regionCode: string) {
        try {
            const response = await fetch(`${API_COMMON_URL}/api/missions/regions/${regionCode}/start`)

            if (!response.ok) {
                throw new Error(`API 오류: ${response.status} ${response.statusText}`)
            }

            return await response.json()

        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.")
        }
    }

    static async submitMission(missionId: number, regionCode: string, body: MissionSubmitBody) {
        try {
            const response = await fetch(`${API_COMMON_URL}/api/missions/${missionId}/regions/${regionCode}/submit`, {
                method: "POST",
                body: JSON.stringify(body),
            })
        
            if (!response.ok) {
                throw new Error(`API 오류: ${response.status} ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.")
        }
    }
    
    static async refreshMission(missionId: number, regionCode: number, body: MissionRefreshBody) {
        try {
            const response = await fetch(`${API_COMMON_URL}/api/missions/${missionId}/regions/${regionCode}/refresh`, {
                method: "POST",
            })
        
            if (!response.ok) {
                throw new Error(`API 오류: ${response.status} ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.")
        }
    }
}