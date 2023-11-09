import { ResponseError, safeFetch } from "@/app/utils/fetchHandler";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest){
    // See: https://github.com/vercel/next.js/discussions/47072#discussioncomment-5291376
    const searchParams = request.nextUrl.searchParams.toString()
    try {
        const posts = await safeFetch(`${process.env.NEXT_API_URL}/posts?${searchParams}`, {next: {revalidate: 60, tags: ["UserPosts"]}})
        // Forward response
        return Response.json(posts)
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