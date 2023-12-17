import { ResponseError, safeFetch } from "@/app/utils/fetchHandler";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams.toString()
    try {
        const body = await request.json()
        const posts = await safeFetch(`${process.env.NEXT_API_URL}/signup/attempt`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body),
            next: {revalidate: 30}
        })
        // Forward response
        return Response.json(posts)
    } catch (err) {
        if (err instanceof ResponseError) {
            return Response.json({
                error: "Failed to fetch"
            }, { status: err.response.status })
        } else {
            console.error(`Failed to do attempt signup: ${err}`)
            return Response.json({
                error: "Unknown error occured"
            }, { status: 500 })
        }
    }
}