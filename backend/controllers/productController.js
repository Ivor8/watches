import Product from '../models/Product.js';
import fs from 'fs/promises';
import path from 'path';

const deleteLocalImage = async (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return;

  let normalized = imagePath.trim();
  const urlMatch = normalized.match(/https?:\/\/[^/]+(\/uploads\/.*)$/);
  if (urlMatch) {
    normalized = urlMatch[1];
  }

  normalized = normalized.replace(/^https?:\/\//, '');
  normalized = normalized.replace(/^.*?\/uploads\//, '/uploads/');
  normalized = path.posix.normalize(normalized).replace(/^\/+/, '/');

  if (!normalized.startsWith('/uploads/')) return;

  const absolutePath = path.join(process.cwd(), normalized.slice(1));
  await fs.unlink(absolutePath).catch(() => null);
};

export const getAllProducts = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : { status: 'active' };
    const products = await Product.find(query).sort({ created_at: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductByHandle = async (req, res) => {
  try {
    const { handle } = req.params;
    const product = await Product.findOne({ handle });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, handle, vendor, product_type, price, compare_at_price, description, tags, metadata, inventory_qty, status, sku, is_latest, images: bodyImages } = req.body;
    
    const latest = is_latest === 'true' || is_latest === true;
    let images = [];
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      images = imageFiles.map((file) => `/uploads/products/${file.name}`);
    } else if (bodyImages) {
      images = typeof bodyImages === 'string'
        ? bodyImages.split(',').map((item) => item.trim()).filter(Boolean)
        : Array.isArray(bodyImages)
          ? bodyImages.map((item) => String(item).trim()).filter(Boolean)
          : [];
    }
    
    const product = new Product({
      name,
      handle,
      vendor,
      product_type,
      price: Math.round(Number(price)),
      compare_at_price: compare_at_price ? Math.round(Number(compare_at_price)) : undefined,
      is_latest: latest,
      description,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      metadata,
      inventory_qty: Number(inventory_qty) || 0,
      status: status || 'active',
      images,
      sku,
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, handle, vendor, product_type, price, compare_at_price, description, tags, metadata, inventory_qty, status, sku, is_latest } = req.body;

    const updateData = {
      name,
      handle,
      vendor,
      product_type,
      price: price ? Math.round(Number(price)) : undefined,
      compare_at_price: compare_at_price ? Math.round(Number(compare_at_price)) : undefined,
      is_latest: is_latest === 'true' || is_latest === true,
      inventory_qty: inventory_qty ? Number(inventory_qty) : undefined,
      status,
      sku,
    };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    
    // Handle new images from uploads or body
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      updateData.images = imageFiles.map((file) => `/uploads/products/${file.name}`);
    } else if (req.body.images) {
      const bodyImages = req.body.images;
      updateData.images = typeof bodyImages === 'string'
        ? bodyImages.split(',').map((item) => item.trim()).filter(Boolean)
        : Array.isArray(bodyImages)
          ? bodyImages.map((item) => String(item).trim()).filter(Boolean)
          : undefined;
    }
    
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const images = Array.isArray(product.images) ? product.images : typeof product.images === 'string' ? product.images.split(',').map((item) => item.trim()).filter(Boolean) : [];
    await Promise.allSettled(images.map((image) => deleteLocalImage(image)));

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q, vendor, product_type, priceMax } = req.query;
    
    let query = { status: 'active' };
    
    if (q) {
      query.$or = [
        { name: new RegExp(q, 'i') },
        { vendor: new RegExp(q, 'i') },
        { product_type: new RegExp(q, 'i') },
      ];
    }
    
    if (vendor) {
      query.vendor = new RegExp(vendor, 'i');
    }
    
    if (product_type) {
      query.product_type = product_type;
    }
    
    if (priceMax) {
      query.price = { $lte: Number(priceMax) * 100 };
    }
    
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
