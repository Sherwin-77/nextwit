"use server"

export default async function handleSignup(prevState: any, formData: FormData) {
    const username = formData.get("username")
    const password = formData.get("password")
    const email = formData.get("email")
    if(!username || !password || !email) return {message: "Missing field", isError: true}
    try {
        const res = await fetch(`${process.env.NEXT_API_URL}/signup/`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            cache: "no-store",
            body: JSON.stringify({
                username: username,
                password: password,
                email: email
            })
        })
        const msg = await res.text()
        if(!res.ok) return {message: msg, isError: true}
        return {message: "Successfully signup", isError: false, redirect: true}
    } catch {
        return { message: "Failed to signup", isError: true }
    }

}