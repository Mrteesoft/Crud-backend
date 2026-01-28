import { Response } from 'express';
import { Merchant } from '../models/merchantModel';
import { MerchantInput } from '../validators/merchantValidators';
import { AuthRequest } from '../middlewares/auth';
import { getLogger } from '../utils/logger';
import { isValidObjectId } from '../utils/ids';

const log = getLogger('MerchantController');

const isAdmin = (req: AuthRequest) => req.user?.role === 'admin';

const ownerFilter = (req: AuthRequest) => (isAdmin(req) ? {} : { owner: req.user?.id });

export const createMerchant = async (req: AuthRequest<{}, {}, MerchantInput>, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Authentication required' });
    const existing = await Merchant.findOne({ name: req.body.name, ...ownerFilter(req) });
    if (existing) return res.status(409).json({ message: 'Merchant already exists', merchant: existing });
    const merchant = await Merchant.create({ ...req.body, owner: req.user.id });
    res.status(201).json(merchant);
  } catch (err: any) {
    log.error('Create merchant failed', { error: err.message });
    res.status(500).json({ message: 'Unable to create merchant' });
  }
};

export const getMerchants = async (req: AuthRequest, res: Response) => {
  try {
    const filter = ownerFilter(req);
    const merchants = await Merchant.find(filter).sort({ createdAt: -1 });
    res.json(merchants);
  } catch (err: any) {
    log.error('List merchants failed', { error: err.message });
    res.status(500).json({ message: 'Unable to list merchants' });
  }
};

export const getMerchantById = async (req: AuthRequest<{ id: string }>, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const filter: any = { _id: req.params.id, ...ownerFilter(req) };
    const merchant = await Merchant.findOne(filter);
    if (!merchant) return res.status(404).json({ message: 'Merchant not found' });
    res.json(merchant);
  } catch (err: any) {
    log.error('Get merchant failed', { error: err.message });
    res.status(500).json({ message: 'Unable to fetch merchant' });
  }
};

export const updateMerchant = async (
  req: AuthRequest<{ id: string }, {}, Partial<MerchantInput>>,
  res: Response
) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const filter: any = { _id: req.params.id, ...ownerFilter(req) };
    const merchant = await Merchant.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });
    if (!merchant) return res.status(404).json({ message: 'Merchant not found' });
    res.json(merchant);
  } catch (err: any) {
    log.error('Update merchant failed', { error: err.message });
    res.status(500).json({ message: 'Unable to update merchant' });
  }
};

export const deleteMerchant = async (req: AuthRequest<{ id: string }>, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const filter: any = { _id: req.params.id, ...ownerFilter(req) };
    const merchant = await Merchant.findOneAndDelete(filter);
    if (!merchant) return res.status(404).json({ message: 'Merchant not found' });
    res.json({ message: 'Merchant deleted' });
  } catch (err: any) {
    log.error('Delete merchant failed', { error: err.message });
    res.status(500).json({ message: 'Unable to delete merchant' });
  }
};