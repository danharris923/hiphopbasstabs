import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { api } from '@/lib/api'
import { VideoPlayer } from '@/components/VideoPlayer'
import { TabDisplay } from '@/components/TabDisplay'
import { PageSkeleton } from '@/components/LoadingSkeleton'
import type { page_payload } from '@/types/schema.d'

interface PairPageProps {
  params: {
    slug: string
  }
}

// Fetch data server-side
async function getData(slug: string): Promise<page_payload> {
  try {
    const data = await api.getPair(slug)
    return data
  } catch (error) {
    console.error('Error fetching pair data:', error)
    notFound()
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PairPageProps): Promise<Metadata> {
  try {
    const data = await getData(params.slug)
    
    const title = `${data.track.title} by ${data.track.artist} - Bass Tab | Bass Tab Site`
    const description = `Learn the bass line from ${data.track.title} (${data.track.year}) which samples ${data.original.title} by ${data.original.artist}. Interactive tabs with synchronized YouTube playback.`
    
    return {
      title,
      description,
      keywords: `${data.track.artist}, ${data.original.artist}, bass tab, hip hop samples, ${data.track.title}, ${data.original.title}`,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: `${data.track.year}-01-01T00:00:00.000Z`,
        authors: ['Bass Tab Site'],
        tags: [data.track.artist, data.original.artist, 'bass tab', 'hip hop samples'],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      }
    }
  } catch (error) {
    return {
      title: 'Track Pair Not Found | Bass Tab Site',
      description: 'The requested track pair could not be found.'
    }
  }
}

// Main component with client-side interactivity
function PairPageContent({ data }: { data: page_payload }) {
  const getSampleTypeInfo = (sampleType: string) => {
    const types = {
      direct: {
        label: 'Direct Sample',
        description: 'Exact audio loop from the original track',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      interpolation: {
        label: 'Interpolation',  
        description: 'Modified or filtered version of the original',
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      },
      replay: {
        label: 'Replay',
        description: 'Re-recorded or replayed version inspired by the original',
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      }
    }
    
    return types[sampleType as keyof typeof types] || types.direct
  }

  const sampleTypeInfo = getSampleTypeInfo(data.sample_map.sample_type || 'direct')

  // Note: handleBarClick is now handled internally by TabDisplay component

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Track Information Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {data.track.title}
            </h1>
            <p className="text-lg text-gray-600 mb-3">
              by <strong>{data.track.artist}</strong> ({data.track.year})
            </p>
            <p className="text-sm text-gray-500">
              Samples: <strong>{data.original.title}</strong> by {data.original.artist} ({data.original.year})
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${sampleTypeInfo.color}`}>
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
              </svg>
              {sampleTypeInfo.label}
            </span>
            
            {data.sample_map.is_bass_sample && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-bass-100 text-bass-800 border border-bass-200">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Bass Sample
              </span>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Information</h3>
          <p className="text-sm text-gray-600 mb-2">{sampleTypeInfo.description}</p>
          {data.sample_map.notes && (
            <p className="text-sm text-gray-600 italic">"{data.sample_map.notes}"</p>
          )}
        </div>
      </div>

      {/* Video Players */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Hip-Hop Track</h2>
          <VideoPlayer
            videoId={data.track.youtube_id}
            startTime={data.sample_map.track_start_sec}
            title={`${data.track.title} - ${data.track.artist}`}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Original Sample</h2>
          <VideoPlayer
            videoId={data.original.youtube_id}
            startTime={data.sample_map.original_start_sec}
            title={`${data.original.title} - ${data.original.artist}`}
            className="w-full"
          />
        </div>
      </div>

      {/* Bass Tab Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <TabDisplay
          tab={data.tab}
          originalVideoId={data.original.youtube_id}
        />
      </div>

      {/* Additional Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Track Details</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-medium text-gray-700">Artist</dt>
              <dd className="text-gray-600">{data.track.artist}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Release Year</dt>
              <dd className="text-gray-600">{data.track.year}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Sample Start</dt>
              <dd className="text-gray-600">{Math.floor(data.sample_map.track_start_sec)}s into the track</dd>
            </div>
            {data.track.spotify_id && (
              <div>
                <dt className="font-medium text-gray-700">Listen</dt>
                <dd>
                  <a 
                    href={`https://open.spotify.com/track/${data.track.spotify_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bass-600 hover:text-bass-700 underline"
                  >
                    Play on Spotify
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Original Track</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-medium text-gray-700">Artist</dt>
              <dd className="text-gray-600">{data.original.artist}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Release Year</dt>
              <dd className="text-gray-600">{data.original.year}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Sampled Section</dt>
              <dd className="text-gray-600">{Math.floor(data.sample_map.original_start_sec)}s into the original</dd>
            </div>
            {data.original.spotify_id && (
              <div>
                <dt className="font-medium text-gray-700">Listen</dt>
                <dd>
                  <a 
                    href={`https://open.spotify.com/track/${data.original.spotify_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bass-600 hover:text-bass-700 underline"
                  >
                    Play on Spotify
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  )
}

// Main page component
export default async function PairPage({ params }: PairPageProps) {
  const data = await getData(params.slug)
  
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PairPageContent data={data} />
    </Suspense>
  )
}

// Generate static params for known routes (optional optimization)
export async function generateStaticParams() {
  try {
    const pairs = await api.listPairs()
    return pairs.map((slug) => ({
      slug,
    }))
  } catch (error) {
    console.warn('Could not generate static params:', error)
    return []
  }
}