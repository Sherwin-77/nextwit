"use server";

import { Session } from "next-auth";

export default async function handleSaveProfile(
  session: Session,
  prevState: any,
  formData: FormData
) {
  const username = formData.get("username");
  const email = formData.get("email");
  const bio = formData.get("bio");
  const newPassword = formData.get("newPassword");
  const oldPassword = formData.get("oldPassword");
  try {
    const res = await fetch(
      `${process.env.NEXT_API_URL}/user/${session.user.id}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
        body: JSON.stringify({
          username: username,
          email: email,
          bio: bio ? bio : undefined,
          newPassword: newPassword ? newPassword : undefined,
          oldPassword: oldPassword ? oldPassword : undefined,
        }),
      }
    );

    let msg = "";
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await res.json();
      msg = data?.error?.msg ?? "Unknown error";
    } else msg = await res.text();
    if (!res.ok) return { message: msg, isError: true };
    return {
      message: "Success",
      isError: false,
    };
  } catch {
    return {
      message: "Failed to update. Please try again later",
      isError: true,
    };
  }
}
