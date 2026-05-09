export type Essay = {
  title: string;
  subtitle?: string;
  date?: string;
  summary: string;
  northSignal?: string;
  whyItMatters?: string;
  tags: string[];
  substackUrl: string;
  image?: string;
};

export type Project = {
  name: string;
  description: string;
  whatItProves: string;
  language?: string;
  tools: string[];
  githubUrl: string;
  stars?: number;
  forks?: number;
  status?: "active" | "paused" | "experiment" | "archived";
  icon?: string;
};

export type Playlist = {
  title: string;
  mood: string;
  whyItBelongs: string;
  northSignal?: string;
  tags: string[];
  spotifyUrl: string;
  image?: string;
};

export type NowItem = {
  area: "Building" | "Writing" | "Reading" | "Listening";
  currentActivity: string;
  whyItMatters?: string;
  lastUpdated?: string;
};
