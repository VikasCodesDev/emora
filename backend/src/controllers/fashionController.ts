import { Request, Response } from 'express';

export const getTrendingOutfits = async (req: Request, res: Response): Promise<void> => {
  try {
    const outfits = [
      {
        id: 1,
        title: "Oversized Streetwear Vibe",
        celebrity: "Billie Eilish",
        items: ["Oversized hoodie", "Baggy jeans", "Chunky sneakers", "Chain necklace"],
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
        price: "$150-$300",
        style: "streetwear"
      },
      {
        id: 2,
        title: "Y2K Aesthetic",
        celebrity: "Olivia Rodrigo",
        items: ["Butterfly top", "Low-rise jeans", "Platform boots", "Tiny sunglasses"],
        imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",
        price: "$100-$250",
        style: "y2k"
      },
      {
        id: 3,
        title: "Dark Academia",
        celebrity: "Timothée Chalamet",
        items: ["Vintage sweater", "Pleated pants", "Oxford shoes", "Leather satchel"],
        imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
        price: "$200-$400",
        style: "academia"
      },
      {
        id: 4,
        title: "Minimalist Chic",
        celebrity: "Zendaya",
        items: ["White tee", "Black trousers", "Blazer", "Statement earrings"],
        imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400",
        price: "$180-$350",
        style: "minimalist"
      },
      {
        id: 5,
        title: "Cottagecore Dream",
        celebrity: "Taylor Swift",
        items: ["Floral dress", "Cardigan", "Mary Janes", "Straw hat"],
        imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400",
        price: "$120-$280",
        style: "cottagecore"
      }
    ];

    res.status(200).json({ success: true, outfits });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch outfits' });
  }
};

export const getOutfitByStyle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { style } = req.params;
    
    const allOutfits = [
      { id: 1, style: "streetwear", title: "Oversized Streetwear Vibe", items: ["Oversized hoodie", "Baggy jeans"] },
      { id: 2, style: "y2k", title: "Y2K Aesthetic", items: ["Butterfly top", "Low-rise jeans"] },
      { id: 3, style: "academia", title: "Dark Academia", items: ["Vintage sweater", "Pleated pants"] }
    ];

    const filtered = allOutfits.filter(o => o.style === style);
    
    res.status(200).json({ success: true, outfits: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch outfits by style' });
  }
};

export const getTrendingItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = [
      { name: "Cargo Pants", trend: "rising", popularity: 95 },
      { name: "Puffer Jackets", trend: "hot", popularity: 88 },
      { name: "Platform Sneakers", trend: "stable", popularity: 82 },
      { name: "Bucket Hats", trend: "rising", popularity: 76 },
      { name: "Oversized Blazers", trend: "hot", popularity: 91 }
    ];

    res.status(200).json({ success: true, items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch trending items' });
  }
};
