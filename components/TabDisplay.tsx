'use client'

import { useState } from 'react'
import type { tab, bar_marker } from '@/types/schema.d'
import { youTubeUtils } from '@/lib/api'

interface TabDisplayProps {
  tab: tab
  originalVideoId: string
  onBarClick?: (timestamp: number) => void
  className?: string
}

export function TabDisplay({ tab, originalVideoId, onBarClick, className = '' }: TabDisplayProps) {
  const [selectedBar, setSelectedBar] = useState<number | null>(null)

  const getDifficultyColor = (difficulty: number): string => {
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

  const getDifficultyLabel = (difficulty: number): string => {
    const labels = ['', 'Beginner', 'Easy', 'Intermediate', 'Hard', 'Expert']
    return labels[difficulty] || 'Unknown'
  }

  const handleBarClick = (bar: bar_marker) => {
    setSelectedBar(bar.bar)
    onBarClick?.(bar.start_sec)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Bass Tab ({tab.tuning} tuning)
          </h2>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(tab.difficulty)}`}>
              {getDifficultyLabel(tab.difficulty)} (Level {tab.difficulty})
            </span>
            <span className="text-sm text-gray-500">
              {tab.bars.length} bar{tab.bars.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="bg-gray-50 p-3 rounded-lg text-xs">
          <div className="font-medium text-gray-700 mb-1">Legend:</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600">
            <div><span className="text-yellow-600 font-mono">0-24</span> Fret numbers</div>
            <div><span className="text-orange-600 font-mono">h</span> Hammer-on</div>
            <div><span className="text-orange-600 font-mono">p</span> Pull-off</div>
            <div><span className="text-orange-600 font-mono">s</span> Slide</div>
            <div><span className="text-orange-600 font-mono">~</span> Vibrato</div>
            <div><span className="text-orange-600 font-mono">x</span> Muted note</div>
          </div>
        </div>
      </div>

      {/* ASCII Tab Display - High Visibility */}
      <div className="bass-tab">
        <pre style={{color: '#00ff00', margin: 0, padding: 0}}>
          {tab.tab_text || 'No tab content available'}
        </pre>
        {/* Debug info */}
        <div style={{color: '#888', fontSize: '10px', marginTop: '8px'}}>
          Tab loaded: {tab.tab_text ? 'Yes' : 'No'} | Length: {tab.tab_text?.length || 0} chars
        </div>
      </div>

      {/* Bar Markers */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">
          Bar Markers - Click to jump to timestamp
        </h3>
        <div className="flex flex-wrap gap-2">
          {tab.bars.map((bar) => (
            <button
              key={bar.bar}
              onClick={() => handleBarClick(bar)}
              className={`bar-marker ${
                selectedBar === bar.bar 
                  ? 'bg-bass-100 border-bass-400 text-bass-800' 
                  : ''
              }`}
              title={`Jump to bar ${bar.bar} at ${Math.floor(bar.start_sec)}s`}
            >
              <span className="font-medium">Bar {bar.bar}</span>
              <span className="text-gray-500 ml-1">
                ({Math.floor(bar.start_sec)}s)
              </span>
            </button>
          ))}
        </div>
        
        {/* External YouTube link for all bars */}
        <div className="pt-2 border-t border-gray-200">
          <a
            href={youTubeUtils.getWatchUrl(originalVideoId, tab.bars[0]?.start_sec || 0)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-bass-600 hover:text-bass-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
            </svg>
            Practice along on YouTube
          </a>
        </div>
      </div>

      {/* Mobile-specific instructions */}
      <div className="md:hidden bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Mobile Tip</h4>
            <p className="text-sm text-blue-700 mt-1">
              Turn your device to landscape mode for better tab viewing. 
              Tap bar markers to jump to specific sections.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}