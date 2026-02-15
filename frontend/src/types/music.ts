export interface Track {
  id: string | number;
  title: string;
  artist: string;
  artistId?: number;
  album: string;
  albumId?: number;
  cover: string;
  coverMedium?: string;
  coverSmall?: string;
  preview: string;
  duration: number;
  link?: string;
}

export interface SavedTrack extends Track {
  _id: string;
  userId: string;
  trackId: string;
  createdAt: string;
}

export interface Album {
  id: number;
  title: string;
  artist: string;
  cover: string;
  releaseDate: string;
  tracks: Track[];
}

export interface Artist {
  id: number;
  name: string;
  picture: string;
  nbAlbum: number;
  nbFan: number;
  topTracks: Track[];
}
