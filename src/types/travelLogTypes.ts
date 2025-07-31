type TravelLogContent = {
    text?: string 
    url?: string
    caption?: string
}

export type TravelLogContents = {
    id: string
    order: number
    type: "text" | "image"
    content: TravelLogContent
}

export type TravelLogDetail = {
    title: string
    visitedAt: string
    contents: TravelLogContents[]
}

export type TravelLogForm = {
    title: string
    sigunguCode: string
    traveledAt: string
    contents: TravelLogContents[]
}

export interface TravelLog {
    id: number
    traveledAt: string
    title: string
}