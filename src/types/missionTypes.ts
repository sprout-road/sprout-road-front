export interface MissionData {
    id: number
    type: string
    description: string
    completed: boolean
}

export type MissionSubmitBody = {
    type: string
    submissionContent: string
}

export type MissionRefreshBody = {
    missonId: number
    regionCode: string
}

export type MissionsInfo = {
    remainingRefreshCount: number
    userMissions: MissionData[] 
}

export interface SubmitMissionParameter {
    missionId: number
    regionCode: string
    body: MissionSubmitBody
}