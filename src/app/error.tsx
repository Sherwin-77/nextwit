'use client'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="w-screen flex flex-col h-screen items-center justify-center">
      <h2 className="mb-5 font-bold text-red-700 dark:text-red-500">Something went wrong!</h2>
      <button className="transition-all border-2 border-orange-500 hover:bg-red-500 rounded-full p-3"  onClick={() => reset()}>Try again</button>
    </div>
  )
}