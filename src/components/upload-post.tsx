import { useFormState } from "react-dom";
import { useRef, useContext, useEffect } from "react"
import handleSubmit from "@/actions/uploadpost-handler";
import { PostContext } from "@/contexts/PostContext";
import SubmitButton from "./submit-button";
import { Session } from "next-auth";

const initialState = {
    message: null,
    isError: false,
    userPost: undefined,
    postID: undefined  // Used as useEffect trigger
}

export default function UploadPost({session}: {session: Session}) {
    const ref = useRef<HTMLFormElement>(null)
    const binded = handleSubmit.bind(null, session)
    const [state, formAction] = useFormState(binded, initialState)
    const {setPosts} = useContext(PostContext)
    useEffect(() => {
        if(state.userPost) setPosts((prev) => ([state.userPost, ...prev]))
    }, [state])
    return (
        <div className="w-full bg-sky-200 dark:bg-slate-800 rounded-xl mb-5">
            <form className="p-5 mb-3" action={(formData: FormData) => {
                // https://stackoverflow.com/questions/77022220/how-to-erase-form-in-next-js-13-4-component-after-server-action
                ref.current?.reset()
                return formAction(formData)
            }} ref={ref}>
                <div className="mb-3 flex flex-col">
                    <span className="text-gray-800 dark:text-gray-500 select-none">Upload Post</span>
                    <textarea name="contents" id="upload-contents" className="p-1 resize-none transition-all my-3 h-[5rem] valid:h-[12rem] focus:h-[12rem] bg-sky-100 focus:outline-neutral-100 dark:focus:outline-sky-400 outline-none focus:bg-white dark:bg-gray-700 dark:focus:bg-gray-600 text-slate-950 dark:text-white" required></textarea>
                </div>
                <div className="flex justify-end mb-3">
                    <SubmitButton message="Upload" loadingMessage="Uploading" />
                </div>
                <span className={"flex justify-end " + (state?.isError ? "text-red-600" : "text-green-600")}>
                    {state?.message}
                </span>
            </form>
        </div>
    )
}