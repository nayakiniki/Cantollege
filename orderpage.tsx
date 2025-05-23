import { Header } from "@/components/header"

export default function MyOrdersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Header />

      <main className="flex-1 container py-8">
        <h1 className="text-4xl font-audiowide text-indigo-400 mb-8 text-center">My Orders</h1>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">You haven't placed any orders yet.</p>
          <a href="/" className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md">
            Browse Menu
          </a>
        </div>
      </main>
    </div>
  )
}
