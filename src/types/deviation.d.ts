export interface GalleryResponse {
    has_more: boolean
    next_offset?: number
    results: Deviation[]
}
export interface GalleryErrorResponse {
    error_descripton: string,
    error: string,
    status: string,
}
export interface Deviation {
    deviationid: string
    title: string
    url: string
    published_time: number

    is_downloadable: boolean
    download_url: string
    download_filesize: number

    content: {
        src: string
        height: number
        width: number
        filesize: number
        transparency: boolean
    }


}
