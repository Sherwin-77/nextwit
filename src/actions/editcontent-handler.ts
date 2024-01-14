"use server"
import { Session } from "next-auth";

export default async function handleEditContent(
    postId: string,
    session: Session,
    prevState: any,
    formData: FormData
  ) {
    try {
      const res = await fetch(`${process.env.NEXT_API_URL}/post/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          contents: formData.get("contents"),
        }),
      });
      if (res.ok) {
        return {
          message: "Success",
          isError: false,
        };
      } else if (res.status == 401)
        return {
          message: "Unauthorized error. Please try to re-login",
          isError: true,
        };
      else
        return {
          message: `Failed to send error status ${res.status}`,
          isError: true,
        };
    } catch (e) {
      return { message: "Failed to send", isError: true };
    }
  }