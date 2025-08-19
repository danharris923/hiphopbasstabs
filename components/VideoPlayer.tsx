'use client'

import { useEffect, useRef, useState } from 'react'
import { youTubeUtils } from '@/lib/api'

interface VideoPlayerProps {
  videoId: string
  startTime: number
  title: string
  className?: string
}

export function VideoPlayer({ videoId, startTime, title, className = '' }: VideoPlayerProps) {
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Validate video ID
    if (!youTubeUtils.isValidVideoId(videoId)) {
      setError('Invalid YouTube video ID')
      setIsLoading(false)
      return
    }

    const loadYouTubeAPI = () => {
      if (!window.YT) {
        // YouTube API not loaded yet, wait for it
        if (!window.onYouTubeIframeAPIReady) {
          window.onYouTubeIframeAPIReady = initializePlayer
        } else {
          // API is loading, add our callback to the queue
          const originalCallback = window.onYouTubeIframeAPIReady
          window.onYouTubeIframeAPIReady = () => {
            originalCallback()
            initializePlayer()
          }
        }
      } else {
        // YouTube API is already loaded
        initializePlayer()
      }
    }

    const initializePlayer = () => {
      if (!containerRef.current) {
        setError('Container not available')
        setIsLoading(false)
        return
      }

      try {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '100%',
          width: '100%',
          videoId,
          playerVars: {
            start: Math.floor(startTime),
            rel: 0, // Don't show related videos from other channels
            modestbranding: 1, // Minimize YouTube branding
            origin: window.location.origin, // Required for API access
            enablejsapi: 1, // Enable JavaScript API
            fs: 1, // Allow fullscreen
            cc_load_policy: 0, // Don't show captions by default
            iv_load_policy: 3, // Don't show video annotations
          },
          events: {
            onReady: (event: any) => {
              console.log('YouTube player ready:', title)
              setIsReady(true)
              setIsLoading(false)
            },
            onError: (event: any) => {
              console.error('YouTube player error:', event.data)
              const errorMessages: { [key: number]: string } = {
                2: 'Invalid video ID',
                5: 'HTML5 player error',
                100: 'Video not found',
                101: 'Video not available in embedded player',
                150: 'Video not available in embedded player'
              }
              setError(errorMessages[event.data] || 'Unknown player error')
              setIsLoading(false)
            },
            onStateChange: (event: any) => {
              // Handle player state changes if needed
              console.log('Player state changed:', event.data)
            }
          }
        })
      } catch (err) {
        console.error('Error creating YouTube player:', err)
        setError('Failed to create video player')
        setIsLoading(false)
      }
    }

    loadYouTubeAPI()

    // Cleanup function
    return () => {
      if (playerRef.current?.destroy) {
        try {
          playerRef.current.destroy()
        } catch (err) {
          console.warn('Error destroying YouTube player:', err)
        }
      }
    }
  }, [videoId, startTime, title])

  const seekTo = (seconds: number) => {
    if (playerRef.current?.seekTo && isReady) {
      try {
        playerRef.current.seekTo(seconds, true)
        console.log(`Seeking to ${seconds}s in ${title}`)
      } catch (err) {
        console.error('Error seeking video:', err)
      }
    } else {
      console.warn('Player not ready for seeking')
    }
  }

  const getCurrentTime = (): number => {
    if (playerRef.current?.getCurrentTime && isReady) {
      try {
        return playerRef.current.getCurrentTime()
      } catch (err) {
        console.error('Error getting current time:', err)
      }
    }
    return 0
  }

  const getPlayerState = (): number => {
    if (playerRef.current?.getPlayerState && isReady) {
      try {
        return playerRef.current.getPlayerState()
      } catch (err) {
        console.error('Error getting player state:', err)
      }
    }
    return -1
  }

  // Expose player methods to parent components
  useEffect(() => {
    if (isReady && playerRef.current) {
      // Store player reference on the container for parent access
      const container = containerRef.current
      if (container) {
        (container as any).playerMethods = {
          seekTo,
          getCurrentTime,
          getPlayerState,
          isReady
        }
      }
    }
  }, [isReady])

  if (error) {
    return (
      <div className={`aspect-video bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="text-sm font-medium text-gray-900">Video Error</h3>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <a
            href={youTubeUtils.getWatchUrl(videoId, startTime)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-sm text-bass-600 hover:text-bass-700"
          >
            Watch on YouTube
            <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bass-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading video...</p>
          </div>
        </div>
      )}
      
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />
      </div>
      
      <div className="mt-2 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {title}
          </h3>
          {startTime > 0 && (
            <p className="text-xs text-gray-500">
              Starts at {Math.floor(startTime)}s
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => seekTo(startTime)}
            disabled={!isReady}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              isReady
                ? 'bg-bass-100 text-bass-700 hover:bg-bass-200 focus:outline-none focus:ring-2 focus:ring-bass-500'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title="Jump to sample start"
          >
            Jump to {Math.floor(startTime)}s
          </button>
          
          <a
            href={youTubeUtils.getWatchUrl(videoId, startTime)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Open on YouTube"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}