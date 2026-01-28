import { Response } from 'express';
import { Product } from '../models/productModel';
import { ProductInput } from '../validators/productValidators';
import { AuthRequest } from '../middlewares/auth';
import { getLogger } from '../utils/logger';
import { isValidObjectId } from '../utils/ids';

const log = getLogger('ProductController');

const ensureOwnerId = (req: AuthRequest, res: Response): string | null => {
  const ownerId = req.user?.id;
  if (!ownerId) {
    res.status(401).json({ message: 'Authentication required' });
    return null;
  }
  return ownerId;
};

export const createProduct = async (req: AuthRequest<{}, {}, ProductInput>, res: Response) => {
  try {
    const ownerId = ensureOwnerId(req, res);
    if (!ownerId) return;
    const product = await Product.create({ ...req.body, owner: ownerId });
    res.status(201).json(product);
  } catch (err: any) {
    log.error('Create product failed', { error: err.message });
    res.status(500).json({ message: 'Unable to create product' });
  }
};

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = ensureOwnerId(req, res);
    if (!ownerId) return;
    const products = await Product.find({ owner: ownerId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err: any) {
    log.error('List products failed', { error: err.message });
    res.status(500).json({ message: 'Unable to list products' });
  }
};

export const getProductById = async (req: AuthRequest<{ id: string }>, res: Response) => {
  try {
    const ownerId = ensureOwnerId(req, res);
    if (!ownerId) return;
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const product = await Product.findOne({ _id: req.params.id, owner: ownerId });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err: any) {
    log.error('Get product failed', { error: err.message });
    res.status(500).json({ message: 'Unable to fetch product' });
  }
};

export const updateProduct = async (
  req: AuthRequest<{ id: string }, {}, Partial<ProductInput>>, 
  res: Response
) => {
  try {
    const ownerId = ensureOwnerId(req, res);
    if (!ownerId) return;
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, owner: ownerId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err: any) {
    log.error('Update product failed', { error: err.message });
    res.status(500).json({ message: 'Unable to update product' });
  }
};

export const deleteProduct = async (req: AuthRequest<{ id: string }>, res: Response) => {
  try {
    const ownerId = ensureOwnerId(req, res);
    if (!ownerId) return;
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const product = await Product.findOneAndDelete({ _id: req.params.id, owner: ownerId });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err: any) {
    log.error('Delete product failed', { error: err.message });
    res.status(500).json({ message: 'Unable to delete product' });
  }
};
