const API_ENDPOINT = process.env.NEXT_PUBLIC_BACKEND_API_BASE;

const toJson = async res => {
    const js = res.json()
    if (res.ok) {
        return js
    } else {
        throw new Error(js.message)
    }
}

// 表示領域内の地点を取得する(領域内4点)
export const getAreaPlaces = async (params) => {
    const usp = new URLSearchParams(params)
    const resp = await fetch(`${API_ENDPOINT}/place?${usp}`, {
        credentials: 'same-origin'
    })
    return await toJson(resp)
}