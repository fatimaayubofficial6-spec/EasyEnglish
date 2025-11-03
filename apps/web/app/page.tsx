import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-center">
        <h1 className={cn("mb-8 text-6xl font-bold")}>
          Welcome to <span className="text-blue-500">EasyEnglish</span>
        </h1>
        <p className="text-xl text-gray-400">Your journey to mastering English starts here.</p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            className={cn(
              "rounded-lg bg-blue-600 px-8 py-3 text-white transition-colors hover:bg-blue-700"
            )}
          >
            Get Started
          </button>
          <button
            className={cn(
              "rounded-lg border border-gray-700 px-8 py-3 transition-colors hover:bg-gray-800"
            )}
          >
            Learn More
          </button>
        </div>
      </div>
    </main>
  );
}
