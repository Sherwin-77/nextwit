"use client"

export default function Loading() {
    return (
        <div className="flex justify-center items-center p-3">
            <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-black motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-blue-500"
                role="status">
            </div>
        </div>
    )
}