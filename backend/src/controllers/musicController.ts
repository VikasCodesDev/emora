import { Request, Response } from 'express';
import axios from 'axios';
import { AuthRequest } from '../middleware/auth';
import Playlist from '../models/Playlist';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let spotifyToken: string = '';
let tokenExpiry: number = 0;

const getSpotifyToken = async (): Promise<string> => {
  if (spotifyToken && Date.now() < tokenExpiry) {
    return spotifyToken;
  }

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
      },
    }
  );

  spotifyToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in * 1000);
  return spotifyToken;
};

export const getTrendingSongs = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get('https://api.spotify.com/v1/browse/featured-playlists', {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit: 1 }
    });

    const playlistId = response.data.playlists.items[0].id;
    const tracks = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit: 20 }
    });

    res.status(200).json({ success: true, songs: tracks.data.items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch trending songs' });
  }
};

export const searchSongs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    const token = await getSpotifyToken();
    
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'track', limit: 20 }
    });

    res.status(200).json({ success: true, songs: response.data.tracks.items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to search songs' });
  }
};

export const getAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const token = await getSpotifyToken();
    
    const response = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.status(200).json({ success: true, album: response.data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch album' });
  }
};

export const getArtist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const token = await getSpotifyToken();
    
    const [artist, topTracks] = await Promise.all([
      axios.get(`https://api.spotify.com/v1/artists/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { market: 'US' }
      })
    ]);

    res.status(200).json({ 
      success: true, 
      artist: artist.data,
      topTracks: topTracks.data.tracks
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch artist' });
  }
};

export const createPlaylist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, tracks } = req.body;
    
    const playlist = await Playlist.create({
      userId: req.user!._id,
      name,
      tracks,
    });

    res.status(201).json({ success: true, playlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create playlist' });
  }
};

export const getUserPlaylists = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const playlists = await Playlist.find({ userId: req.user!._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, playlists });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch playlists' });
  }
};
