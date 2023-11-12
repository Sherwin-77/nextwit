import { useFormState, useFormStatus } from "react-dom";
import { useRef, useContext, useEffect } from "react"
import handleSubmit from "@/app/actions/uploadpost-handler";
import { PostContext } from "../contexts/PostContext";

const initialState = {
    message: null,
    isError: false,
    userPost: undefined,
    postID: undefined  // Used as useEffect trigger
}


function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button className="bg-sky-200 dark:bg-sky-700 hover:bg-sky-400 dark:text-white text-black py-3 px-8 rounded-full disabled:opacity-75" aria-disabled={pending} disabled={pending}>
            {pending && <svg aria-hidden="true" role="status" className="inline w-5 h-5 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
            </svg>}
            {pending ? "Uploading" : "Upload"}
        </button>
    )
}

export default function UploadPost() {
    const ref = useRef<HTMLFormElement>(null)  // TODO: Change later to personalized UID and authorization?
    const [state, formAction] = useFormState(handleSubmit, initialState)
    const {setPosts} = useContext(PostContext)
    useEffect(() => {
        if(state.userPost) setPosts((prev) => ([state.userPost, ...prev]))
    }, [state])
    return (
        <div className="w-full bg-neutral-100 dark:bg-slate-800 rounded-xl mb-5">
            <form className="p-5 mb-3" action={(formData: FormData) => {
                // https://stackoverflow.com/questions/77022220/how-to-erase-form-in-next-js-13-4-component-after-server-action
                ref.current?.reset()
                return formAction(formData)
            }} ref={ref}>
                <div className="mb-3 flex flex-col">
                    <span className="text-slate-700 dark:text-gray-500 select-none">Upload Post</span>
                    <textarea name="contents" id="upload-contents" className="p-1 resize-none transition-all my-3 h-[5rem] valid:h-[12rem] focus:h-[12rem] bg-slate-300 focus:outline-sky-400 outline-none focus:bg-sky-300 dark:bg-gray-700 dark:focus:bg-gray-600 text-slate-950 dark:text-white" required></textarea>
                </div>
                <div className="flex justify-end mb-3">
                    <SubmitButton />
                </div>
                <span className={"flex justify-end " + (state?.isError ? "text-red-600" : "text-green-600")}>
                    {state?.message}
                </span>
            </form>
        </div>
    )
}