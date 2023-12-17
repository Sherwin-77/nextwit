import { ResponseError, safeFetch } from "@/app/utils/fetchHandler";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  const uid = params.uid;
  const url = new URL(`${process.env.NEXT_API_URL}/user/${uid}`);
  url.search = request.nextUrl.search;
  try {
    const user = await safeFetch(url);
    // Forward response
    return Response.json(user);
  } catch (err) {
    if (err instanceof ResponseError) {
      return Response.json(
        {
          error: "Failed to fetch",
        },
        { status: err.response.status }
      );
    } else {
      console.error(`Failed to get user ${uid}: ${err}`);
      return Response.json(
        {
          error: "Unknown error occured",
        },
        { status: 500 }
      );
    }
  }
}
