import { Request, Response } from 'express';
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export const getWallpapers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category = 'nature', page = 1 } = req.query;
    
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      },
      params: {
        query: category,
        page,
        per_page: 30,
        orientation: 'landscape'
      }
    });

    const wallpapers = response.data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      fullUrl: photo.urls.full,
      thumbnail: photo.urls.small,
      author: photo.user.name,
      authorUrl: photo.user.links.html,
      downloadUrl: photo.links.download,
      description: photo.description || photo.alt_description
    }));

    res.status(200).json({ success: true, wallpapers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch wallpapers' });
  }
};

export const downloadWallpaper = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await axios.get(`https://api.unsplash.com/photos/${id}/download`, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    res.status(200).json({ success: true, message: 'Download tracked' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to track download' });
  }
};
