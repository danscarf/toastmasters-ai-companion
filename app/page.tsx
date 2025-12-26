// app/page.tsx
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-24 pb-12 px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Welcome to RoleCopilot
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Select a tool from the navigation bar to get started.
        </p>
      </div>
    </div>
  );
}
