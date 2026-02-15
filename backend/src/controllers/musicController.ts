import { Request, Response } from 'express';
import axios from 'axios';
import { AuthRequest } from '../middleware/auth';
import SavedMusic from '../models/SavedMusic';

export const searchMusic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    console.log('Search request received:', query);

    if (!query || typeof query !== 'string') {
      res.status(400).json({ success: false, message: 'Query parameter required' });
      return;
    }

    // Try iTunes API (works globally)
    const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=20`;
    console.log('Calling iTunes API:', apiUrl);

    const response = await axios.get(apiUrl);

    console.log('iTunes response received:', response.data.results?.length || 0, 'tracks');

    if (!response.data || !response.data.results) {
      res.status(500).json({ success: false, message: 'Invalid API response' });
      return;
    }

    const tracks = response.data.results.map((track: any) => ({
      id: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      artistId: track.artistId,
      album: track.collectionName,
      albumId: track.collectionId,
      cover: track.artworkUrl100.replace('100x100', '600x600'),
      coverMedium: track.artworkUrl100.replace('100x100', '300x300'),
      coverSmall: track.artworkUrl100,
      preview: track.previewUrl,
      duration: Math.floor(track.trackTimeMillis / 1000),
      link: track.trackViewUrl
    }));

    res.status(200).json({ success: true, tracks });
  } catch (error: any) {
    console.error('Search music error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to search music',
      error: error.message 
    });
  }
};

export const getTrending = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Fetching trending music...');

    // iTunes trending - popular songs
    const apiUrl = 'https://itunes.apple.com/search?term=top+songs+2024&media=music&entity=song&limit=20';
    console.log('Calling iTunes API:', apiUrl);

    const response = await axios.get(apiUrl);

    console.log('iTunes trending response received');

    if (!response.data || !response.data.results) {
      console.error('Invalid iTunes response structure');
      res.status(500).json({ success: false, message: 'Invalid API response' });
      return;
    }

    const tracks = response.data.results.map((track: any) => ({
      id: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      artistId: track.artistId,
      album: track.collectionName,
      albumId: track.collectionId,
      cover: track.artworkUrl100.replace('100x100', '600x600'),
      coverMedium: track.artworkUrl100.replace('100x100', '300x300'),
      coverSmall: track.artworkUrl100,
      preview: track.previewUrl,
      duration: Math.floor(track.trackTimeMillis / 1000),
      link: track.trackViewUrl
    }));

    console.log('Returning', tracks.length, 'trending tracks');
    res.status(200).json({ success: true, tracks });
  } catch (error: any) {
    console.error('Get trending error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get trending music',
      error: error.message 
    });
  }
};

export const getAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const response = await axios.get(`https://itunes.apple.com/lookup?id=${id}&entity=song`);

    if (!response.data || !response.data.results) {
      res.status(404).json({ success: false, message: 'Album not found' });
      return;
    }

    const albumData = response.data.results[0];
    const tracks = response.data.results.slice(1).map((track: any) => ({
      id: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      artistId: track.artistId,
      album: track.collectionName,
      albumId: track.collectionId,
      cover: track.artworkUrl100.replace('100x100', '600x600'),
      coverMedium: track.artworkUrl100.replace('100x100', '300x300'),
      coverSmall: track.artworkUrl100,
      preview: track.previewUrl,
      duration: Math.floor(track.trackTimeMillis / 1000),
      link: track.trackViewUrl
    }));

    res.status(200).json({
      success: true,
      album: {
        id: albumData.collectionId,
        title: albumData.collectionName,
        artist: albumData.artistName,
        cover: albumData.artworkUrl100.replace('100x100', '600x600'),
        releaseDate: albumData.releaseDate,
        tracks
      }
    });
  } catch (error: any) {
    console.error('Get album error:', error);
    res.status(500).json({ success: false, message: 'Failed to get album' });
  }
};

export const getArtist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const response = await axios.get(`https://itunes.apple.com/lookup?id=${id}&entity=song&limit=10`);

    if (!response.data || !response.data.results) {
      res.status(404).json({ success: false, message: 'Artist not found' });
      return;
    }

    const artistData = response.data.results[0];
    const tracks = response.data.results.slice(1).map((track: any) => ({
      id: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      artistId: track.artistId,
      album: track.collectionName,
      albumId: track.collectionId,
      cover: track.artworkUrl100.replace('100x100', '600x600'),
      coverMedium: track.artworkUrl100.replace('100x100', '300x300'),
      coverSmall: track.artworkUrl100,
      preview: track.previewUrl,
      duration: Math.floor(track.trackTimeMillis / 1000),
      link: track.trackViewUrl
    }));

    res.status(200).json({
      success: true,
      artist: {
        id: artistData.artistId,
        name: artistData.artistName,
        picture: artistData.artworkUrl100?.replace('100x100', '600x600') || '',
        topTracks: tracks
      }
    });
  } catch (error: any) {
    console.error('Get artist error:', error);
    res.status(500).json({ success: false, message: 'Failed to get artist' });
  }
};

export const saveMusic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { trackId, title, artist, album, cover, preview, duration } = req.body;

    const existingSave = await SavedMusic.findOne({
      userId: req.user!._id,
      trackId
    });

    if (existingSave) {
      res.status(400).json({ success: false, message: 'Track already saved' });
      return;
    }

    const savedMusic = await SavedMusic.create({
      userId: req.user!._id,
      trackId,
      title,
      artist,
      album,
      cover,
      preview,
      duration
    });

    res.status(201).json({ success: true, message: 'Track saved', data: savedMusic });
  } catch (error: any) {
    console.error('Save music error:', error);
    res.status(500).json({ success: false, message: 'Failed to save track' });
  }
};

export const getSavedMusic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const savedTracks = await SavedMusic.find({ userId: req.user!._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, tracks: savedTracks });
  } catch (error: any) {
    console.error('Get saved music error:', error);
    res.status(500).json({ success: false, message: 'Failed to get saved music' });
  }
};

export const removeSavedMusic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await SavedMusic.findOneAndDelete({
      _id: id,
      userId: req.user!._id
    });

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Track not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Track removed' });
  } catch (error: any) {
    console.error('Remove saved music error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove track' });
  }
};
