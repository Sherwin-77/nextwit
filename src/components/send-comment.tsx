import handleCommentSubmit from "@/actions/addcoment-handler";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState = {
  message: null,
  isError: false,
};

// https://react.dev/reference/react-dom/hooks/useFormStatus#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component
function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="absolute top-4 right-3 disabled:opacity-30"
    >
      <PaperAirplaneIcon className="h-6" />
    </button>
  );
}

export default function SendComment({
  session,
  postId,
}: {
  session: Session;
  postId: string;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const binded = handleCommentSubmit.bind(null, postId, session);
  const [state, formAction] = useFormState(binded, initialState);
  const router = useRouter();
  // https://stackoverflow.com/questions/68256410/typing-an-inputs-keyup-in-react-typescript
  const onEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      ref.current?.requestSubmit();
    }
  };
  useEffect(() => {
    if (state.message === "Success" && !state.isError) {
        state.message = null;
        router.refresh();
    }
  }, [state])
  return (
    <div className="my-3 pb-5 px-8">
      <form
        className="flex flex-col"
        action={(formData: FormData) => {
          ref.current?.reset();
          return formAction(formData);
        }}
        ref={ref}
      >
        <label htmlFor="comment-bar" className="mb-1">
          Add your comment
        </label>
        <div className="relative">
          <textarea
            className="w-full resize-none overflow-hidden border border-gray-400 dark:border-none py-1 ps-1 pe-8 dark:bg-slate-700 text-black dark:text-white rounded-md dark:focus:outline-none dark:focus:ring dark:focus:ring-yellow-300"
            id="comment-bar"
            name="contents"
            onKeyDown={onEnter}
          />
          <Submit />
          <span
            className={
              "flex justify-end " +
              (state?.isError ? "text-red-600" : "text-green-600")
            }
          >
            {state?.message}
          </span>
        </div>
      </form>
    </div>
  );
}
