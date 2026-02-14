export type RecordData = {
    url: string,
    type: string,
    code: string
}

export type PronList = {
    list: RecordData[],
    currentIndex: number,
    isStale: boolean
}
