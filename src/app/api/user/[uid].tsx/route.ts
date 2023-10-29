import { ResponseError, safeFetch } from "@/app/utils/fetchHandler"

export async function GET(
    request: Request,
    { params }: { params: { uid: string } }
  ) {
    const uid = params.uid
    try {
        const user = await safeFetch(`${process.env.NEXT_API_URL}/user/${uid}`, undefined, false)
        // Forward response
        return Response.json(user)
    } catch (err){
        if (err instanceof ResponseError) {
            return Response.json({
                error: "Failed to fetch"
            }, {status: err.response.status})
        } else {
            console.error(`Failed to get user ${uid}: ${err}`)
            return Response.json({
                error: "Unknown error occured"
            }, {status: 500})
        }
    }

  }