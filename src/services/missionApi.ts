import { API_COMMON_URL } from "../constants/constants";
import { MissionRefreshBody, MissionSubmitBody } from "../types/missionTypes";

export class missionApi {
    static async getMissionStatus(regionCode: string): Promise<boolean> {
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

            if (imageFile.size > 10 * 1024 * 1024) { 
                throw new Error("파일 크기가 너무 큽니다 (10MB 이하만 가능)");
            }

            if (!imageFile.type.startsWith('image/')) {
                throw new Error("이미지 파일만 업로드 가능합니다");
            }

            const formData = new FormData();
            formData.append('imageFile', imageFile);

            const response = await fetch(`${API_COMMON_URL}/api/missions/images/upload`, {
                method: "POST",
                body: formData,
            })
        
            if (!response.ok) {
                throw new Error(`API 오류: ${response.status} ${response.statusText}`)
            }

            return await response.text()
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.")
        }
    }

    static async startMission(regionCode: string) {
        try {
            const response = await fetch(`${API_COMMON_URL}/api/missions/regions/${regionCode}/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })

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
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(body),
            })
        
            if (!response.ok) {
                throw new Error(`API 오류: ${response.status} ${response.statusText}`)
            }

            if (body.type === "writing") {
                return await response.json()
            } else if (body.type === "picture"){
                return await response.text()
            }

        } catch (error) {
            throw new Error(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.")
        }
    }
    
    static async refreshMission(missionId: number, regionCode: string) {
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