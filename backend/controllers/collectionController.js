import Collection from '../models/Collection.js';

export const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ is_visible: true });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCollectionByHandle = async (req, res) => {
  try {
    const { handle } = req.params;
    const collection = await Collection.findOne({ handle });
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCollection = async (req, res) => {
  try {
    const { handle, title, description, image_url, is_visible } = req.body;
    
    const collection = new Collection({
      handle,
      title,
      description,
      image_url,
      is_visible: is_visible !== undefined ? is_visible : true,
    });
    
    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { handle, title, description, image_url, is_visible } = req.body;
    
    const collection = await Collection.findByIdAndUpdate(
      id,
      { handle, title, description, image_url, is_visible },
      { new: true }
    );
    
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    await Collection.findByIdAndDelete(id);
    res.json({ message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
