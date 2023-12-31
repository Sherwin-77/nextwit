import { ResponseError, safeFetch } from "@/app/utils/fetchHandler";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json("Unautohorized", { status: 401 });
  try {
    await safeFetch(
      `${process.env.NEXT_API_URL}/comment/${params.commentId}`,
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
      console.error(`Failed to get delete comment: ${err}`);
      return Response.json(
        {
          error: "Unknown error occured",
        },
        { status: 500 }
      );
    }
  }
}
