import type { AmbientTrackId } from "./audioService";

export interface TrackMeta {
  id: string;
  title: string;
  artist: string;
  durationSeconds: number;
  src: string;
}

export interface AmbientMeta {
  id: AmbientTrackId;
  emoji: string;
}

export const PLAYLIST: TrackMeta[] = [
  {
    id: "track01",
    title: "Lofi Piano Study",
    artist: "minu garden",
    durationSeconds: 180,
    src: "/sounds/music/track01.mp3",
  },
  {
    id: "track02",
    title: "Rainy Afternoon",
    artist: "minu garden",
    durationSeconds: 210,
    src: "/sounds/music/track02.mp3",
  },
  {
    id: "track03",
    title: "Chill Garden",
    artist: "minu garden",
    durationSeconds: 195,
    src: "/sounds/music/track03.mp3",
  },
  {
    id: "track04",
    title: "Midnight Focus",
    artist: "minu garden",
    durationSeconds: 240,
    src: "/sounds/music/track04.mp3",
  },
  {
    id: "track05",
    title: "Cozy Morning",
    artist: "minu garden",
    durationSeconds: 175,
    src: "/sounds/music/track05.mp3",
  },
  {
    id: "track06",
    title: "Warm Beats",
    artist: "minu garden",
    durationSeconds: 220,
    src: "/sounds/music/track06.mp3",
  },
];

export const AMBIENT_TRACKS: AmbientMeta[] = [
  { id: "rain", emoji: "🌧" },
  { id: "forest", emoji: "🌿" },
  { id: "cafe", emoji: "☕" },
  { id: "fireplace", emoji: "🔥" },
  { id: "white_noise", emoji: "〜" },
];