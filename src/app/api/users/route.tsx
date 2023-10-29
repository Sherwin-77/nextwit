import { ResponseError, safeFetch } from "@/app/utils/fetchHandler";

export async function GET(request: Request){
    try {
        const users = await safeFetch(`${process.env.NEXT_API_URL}/users/`, undefined, false)
        // Forward response
        return Response.json(users)
    } catch (err){
        if (err instanceof ResponseError) {
            return Response.json({
                error: "Failed to fetch"
            }, {status: err.response.status})
        } else {
            console.error(`Failed to get user list: ${err}`)
            return Response.json({
                error: "Unknown error occured"
            }, {status: 500})
        }
    }
}