import Link from 'next/link'
import { api } from '@/lib/api'

// Fetch available pairs from API
async function getFeaturedPairs() {
  try {
    const pairs = await api.listPairs()
    console.log('Available pairs from API:', pairs)
    
    // For each pair, fetch basic info to create featured list
    const featuredData = []
    for (const slug of pairs.slice(0, 6)) { // Show first 6 tracks
      try {
        const data = await api.getPair(slug)
        featuredData.push({
          slug,
          track: `${data.track.title} - ${data.track.artist}`,
          original: `${data.original.title} - ${data.original.artist}`,
          year: data.track.year,
          sampleType: data.sample_map.sample_type,
          difficulty: data.tab.difficulty
        })
      } catch (error) {
        console.error(`Error fetching data for ${slug}:`, error)
      }
    }
    
    return featuredData
  } catch (error) {
    console.error('Error fetching pairs:', error)
    // Fallback to original hardcoded data
    return [
      {
        slug: 'notorious-big-juicy',
        track: 'Juicy - The Notorious B.I.G.',
        original: 'Juicy Fruit - Mtume',
        year: 1994,
        sampleType: 'direct',
        difficulty: 2
      },
      {
        slug: 'dr-dre-nuthin-but-g-thang',
        track: "Nuthin' But a 'G' Thang - Dr. Dre ft. Snoop Dogg",
        original: "I Want'a Do Something Freaky to You - Leon Haywood",
        year: 1992,
        sampleType: 'interpolation',
        difficulty: 3
      },
      {
        slug: 'public-enemy-fight-the-power',
        track: 'Fight the Power - Public Enemy',
        original: 'Funky President - James Brown',
        year: 1989,
        sampleType: 'replay',
        difficulty: 4
      }
    ]
  }
}

function getDifficultyColor(difficulty: number): string {
  switch (difficulty) {
    case 1:
    case 2:
      return 'bg-green-100 text-green-800'
    case 3:
      return 'bg-yellow-100 text-yellow-800'
    case 4:
    case 5:
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getDifficultyLabel(difficulty: number): string {
  const labels = ['', 'Beginner', 'Easy', 'Intermediate', 'Hard', 'Expert']
  return labels[difficulty] || 'Unknown'
}

function getSampleTypeColor(sampleType: string): string {
  switch (sampleType) {
    case 'direct':
      return 'bg-blue-100 text-blue-800'
    case 'interpolation':
      return 'bg-purple-100 text-purple-800'
    case 'replay':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default async function HomePage() {
  const FEATURED_PAIRS = await getFeaturedPairs()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl mb-6">
          Learn Bass Lines from
          <span className="text-bass-600 block">Hip-Hop's Greatest Samples</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Discover the bass lines behind classic hip-hop tracks by exploring their original samples. 
          Interactive tabs with synchronized YouTube playback help you master the fundamentals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#featured"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-bass-600 hover:bg-bass-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bass-500 transition-colors"
          >
            Explore Featured Tracks
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href="/about"
            className="inline-flex items-center px-6 py-3 border border-bass-300 text-base font-medium rounded-md text-bass-700 bg-white hover:bg-bass-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bass-500 transition-colors"
          >
            How It Works
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Bass Tab Site?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-bass-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-bass-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m1 6V4a3 3 0 012-2.836M15 8h-3m0 0V4a3 3 0 012.745-2.994" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Synchronized Playback
            </h3>
            <p className="text-gray-600">
              Watch both the hip-hop track and original sample side-by-side. 
              Jump to specific sections with clickable bar markers.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-bass-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-bass-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ASCII Bass Tabs
            </h3>
            <p className="text-gray-600">
              Clean, readable bass tablature with timing information. 
              Perfect for learning the exact fingering and rhythm patterns.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-bass-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-bass-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sample Analysis
            </h3>
            <p className="text-gray-600">
              Understand how each sample was used - direct loops, interpolations, 
              or replayed sections. Learn from the masters of hip-hop production.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Tracks Section */}
      <div id="featured">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Featured Track Pairs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PAIRS.map((pair) => (
            <Link
              key={pair.slug}
              href={`/pairs/${pair.slug}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSampleTypeColor(pair.sampleType)}`}>
                    {pair.sampleType}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(pair.difficulty)}`}>
                    {getDifficultyLabel(pair.difficulty)}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-bass-600 transition-colors">
                  {pair.track}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Samples:</strong> {pair.original}
                </p>
                <p className="text-xs text-gray-500">
                  Released {pair.year}
                </p>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center text-sm text-bass-600 group-hover:text-bass-700">
                  <span>View bass tab</span>
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 bg-bass-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Learn?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Start with any of the featured tracks above, or explore our complete collection 
          of hip-hop samples and their bass line breakdowns.
        </p>
        <Link
          href="/pairs"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-bass-600 hover:bg-bass-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bass-500 transition-colors"
        >
          Browse All Tracks
          <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  )
}