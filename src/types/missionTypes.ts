export interface MissionData {
    id: number
    type: string
    description: string
    success: boolean
}

export type MissionSubmitBody = {
    type: string
    submissionContent: string
}

export type MissionRefreshBody = {
    missonId: number
    regionCode: string
}