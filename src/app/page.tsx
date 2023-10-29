export default function RootPage() {
  async function ping() {
    const response = await fetch("http://localhost:8000/test")
    const data = await response.text()
    alert(`Response from server: ${data}`)
  }
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="my-5 p-5 rounded-3xl relative overflow-hidden inline-block shadow-neon before:content-[''] before:block before:bg-google before:w-[102%] before:pb-[102%] before:absolute before:left-1/2 before:top-1/2 before:translate-x-2/4 before:translate-y-2/4 before:-z-20 before:animate-spin-slow after:content-[''] after:absolute after:inset-1 after:bg-black after:-z-10 after:rounded-3xl">
        <h1 className="text-5xl">Nextwit</h1>
      </div>
      <p>Yet another website</p>
      <button type="button" className="rounded-full bg-gray border my-5 transition-all linear duration-300 hover:text-cyan-400 hover:-translate-y-1 tranform-gpu hover:shadow-neon focus:ring-2 focus:ring-offset-2 focus:ring-white">
        <a href="/home" className="block p-3">Go Home</a>
      </button>
    </main>
  )
}