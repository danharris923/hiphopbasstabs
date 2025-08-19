// Auto-generated TypeScript types from JSON Schema
// Generated on 2025-08-18T12:47:31.737Z
// Do not edit manually - regenerate using npm run generate-types

export interface page_payload {
  /** The hip-hop track that contains the sample */
  track: Track;
  /** The original track that was sampled */
  original: Original;
  /** Information about how the track samples the original */
  sample_map: SampleMap;
  /** Bass tab notation with timing markers */
  tab: Tab;
}

export interface track {
  /** Track title */
  title: string;
  /** Artist name */
  artist: string;
  /** Release year */
  year: number;
  /** YouTube video ID (11 characters) */
  youtube_id: string;
  /** Spotify track ID (22 characters) */
  spotify_id?: string | null;
}

export interface original {
  /** Original track title */
  title: string;
  /** Original artist name */
  artist: string;
  /** Original release year */
  year: number;
  /** YouTube video ID for original track */
  youtube_id: string;
  /** Spotify track ID for original */
  spotify_id?: string | null;
}

export interface sample_map {
  /** Whether this sample specifically involves bass instruments */
  is_bass_sample?: boolean;
  /** Type of sampling: direct loop, interpolation (modified), or replay */
  sample_type?: "direct" | "interpolation" | "replay";
  /** Start time in seconds where sample begins in the track */
  track_start_sec: number;
  /** Start time in seconds of the sampled section in original */
  original_start_sec: number;
  /** Additional notes about the sample */
  notes?: string | null;
}

export interface tab {
  /** Bass tuning (standard 4-string EADG, 5-string BEADG, or alternate tunings) */
  tuning?: "EADG" | "BEADG" | "DADG" | "CGCF";
  /** Difficulty level from 1 (beginner) to 5 (expert) */
  difficulty: number;
  /** ASCII tab notation with line breaks */
  tab_text: string;
  /** List of bar timing markers */
  bars: BarMarker[];
}

export interface bar_marker {
  /** Bar number (1-indexed) */
  bar: number;
  /** Start time in seconds for this bar */
  start_sec: number;
}

export interface error_detail {
  /** Error message */
  error: string;
  /** Additional error details */
  detail?: string | null;
  /** Error timestamp */
  timestamp?: string;
}

export interface health_check {
  /** Service status */
  status: "ok" | "error";
  /** Check timestamp */
  timestamp?: string;
  /** API version */
  version?: string;
}

// Utility types
export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type ApiError = {
  error: string;
  detail?: string;
  timestamp: string;
};

// YouTube player types
export interface YouTubePlayer {
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  getCurrentTime(): number;
  getPlayerState(): number;
  destroy(): void;
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string | HTMLElement, config: any) => YouTubePlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}
