import Link from 'next/link'
import { api } from '@/lib/api'

// Page to list all available track pairs
export default async function PairsPage() {
  let pairs: string[] = []
  let error = null
  
  try {
    pairs = await api.listPairs()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error'
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        All Bass Tab Pairs
      </h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error loading pairs: {error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Available Tracks ({pairs.length})
        </h2>
        
        {pairs.length === 0 ? (
          <p className="text-gray-600">No tracks available.</p>
        ) : (
          <ul className="space-y-3">
            {pairs.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/pairs/${slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-bass-300 hover:bg-bass-50 transition-colors"
                >
                  <code className="text-bass-600 font-mono">{slug}</code>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-8">
        <Link
          href="/"
          className="text-bass-600 hover:text-bass-700 underline"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}