import { ResponseError, safeFetch } from "@/app/utils/fetchHandler";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// https://github.com/nextauthjs/next-auth/issues/7423

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json("Unautohorized", { status: 401 });
  try {
    const likeStatus = await safeFetch(
      `${process.env.NEXT_API_URL}/like/${params.postId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      },
      false
    );
    return Response.json("OK");
  } catch (err) {
    if (err instanceof ResponseError) {
      return Response.json(
        {
          error: "Failed to fetch",
        },
        { status: err.response.status }
      );
    } else {
      console.error(`Failed to add like: ${err}`);
      return Response.json(
        {
          error: "Unknown error occured",
        },
        { status: 500 }
      );
    }
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json("Unautohorized", { status: 401 });
  try {
    const likeStatus = await safeFetch(
      `${process.env.NEXT_API_URL}/like/${params.postId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      },
      false
    );
    return Response.json("OK");
  } catch (err) {
    if (err instanceof ResponseError) {
      return Response.json(
        {
          error: "Failed to fetch",
        },
        { status: err.response.status }
      );
    } else {
      console.error(`Failed to delete like: ${err}`);
      return Response.json(
        {
          error: "Unknown error occured",
        },
        { status: 500 }
      );
    }
  }
}
