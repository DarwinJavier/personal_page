export type Essay = {
  slug: string;
  title: string;
  subtitle?: string;
  sourceUrl: string;
  date: string;
  summary: string;
  northSignal: string;
  whyItMatters: string;
  tags: string[];
  featured?: boolean;
  relatedProjectSlug?: string;
  relatedPlaylistSlug?: string;
  image?: string;
};

export type Project = {
  slug: string;
  title: string;
  githubUrl: string;
  language?: string;
  shortDescription: string;
  plainEnglishDescription: string;
  whatThisProves: string;
  builtWith: string[];
  northSignal: string;
  featured?: boolean;
  image?: string;
};

export type Playlist = {
  slug: string;
  title: string;
  spotifyUrl: string;
  mood: string;
  whyItBelongsHere: string;
  northSignal: string;
  tags: string[];
  featured?: boolean;
  coverImage?: string;
};
