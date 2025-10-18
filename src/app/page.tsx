export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Learn Authentication
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          A Next.js application for learning authentication patterns
        </p>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>
    </main>
  );
}
