import { Response } from 'express';
import { Purchase } from '../models/purchaseModel';
import { Installment } from '../models/installmentModel';
import { PurchaseInput } from '../validators/purchaseValidators';
import { AuthRequest } from '../middlewares/auth';
import { buildInstallments } from '../utils/installments';
import { getLogger } from '../utils/logger';
import { isValidObjectId } from '../utils/ids';

const log = getLogger('PurchaseController');

const ownerIdFromReq = (req: AuthRequest, res: Response) => {
  const id = req.user?.id;
  if (!id) {
    res.status(401).json({ message: 'Authentication required' });
    return null;
  }
  return id;
};

export const createPurchase = async (req: AuthRequest<{}, {}, PurchaseInput>, res: Response) => {
  try {
    const ownerId = ownerIdFromReq(req, res);
    if (!ownerId) return;

    const purchase = await Purchase.create({ ...req.body, createdBy: ownerId });
    const installments = buildInstallments(purchase);
    await Installment.insertMany(installments);

    res.status(201).json(purchase);
  } catch (err: any) {
    log.error('Create purchase failed', { error: err.message });
    res.status(500).json({ message: 'Unable to create purchase' });
  }
};

export const getPurchases = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = ownerIdFromReq(req, res);
    if (!ownerId) return;
    const { status } = req.query as { status?: string };
    const query: any = { createdBy: ownerId };
    if (status) query.status = status;
    const purchases = await Purchase.find(query).sort({ createdAt: -1 });
    res.json(purchases);
  } catch (err: any) {
    log.error('List purchases failed', { error: err.message });
    res.status(500).json({ message: 'Unable to list purchases' });
  }
};

export const getPurchaseById = async (req: AuthRequest<{ id: string }>, res: Response) => {
  try {
    const ownerId = ownerIdFromReq(req, res);
    if (!ownerId) return;
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const purchase = await Purchase.findOne({ _id: req.params.id, createdBy: ownerId });
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    res.json(purchase);
  } catch (err: any) {
    log.error('Get purchase failed', { error: err.message });
    res.status(500).json({ message: 'Unable to fetch purchase' });
  }
};

export const updatePurchase = async (
  req: AuthRequest<{ id: string }, {}, Partial<PurchaseInput>>, 
  res: Response
) => {
  try {
    const ownerId = ownerIdFromReq(req, res);
    if (!ownerId) return;
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const purchase = await Purchase.findOneAndUpdate(
      { _id: req.params.id, createdBy: ownerId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    res.json(purchase);
  } catch (err: any) {
    log.error('Update purchase failed', { error: err.message });
    res.status(500).json({ message: 'Unable to update purchase' });
  }
};

export const deletePurchase = async (req: AuthRequest<{ id: string }>, res: Response) => {
  try {
    const ownerId = ownerIdFromReq(req, res);
    if (!ownerId) return;
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const purchase = await Purchase.findOneAndDelete({ _id: req.params.id, createdBy: ownerId });
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    await Installment.deleteMany({ purchaseId: purchase._id });
    res.json({ message: 'Purchase deleted' });
  } catch (err: any) {
    log.error('Delete purchase failed', { error: err.message });
    res.status(500).json({ message: 'Unable to delete purchase' });
  }
};

export const getInstallments = async (req: AuthRequest<{ id: string }>, res: Response) => {
  try {
    const ownerId = ownerIdFromReq(req, res);
    if (!ownerId) return;
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const purchase = await Purchase.findOne({ _id: req.params.id, createdBy: ownerId });
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    const installments = await Installment.find({ purchaseId: purchase._id }).sort({ sequence: 1 });
    res.json(installments);
  } catch (err: any) {
    log.error('Get installments failed', { error: err.message });
    res.status(500).json({ message: 'Unable to fetch installments' });
  }
};

export const payNextInstallment = async (req: AuthRequest<{ id: string }>, res: Response) => {
  try {
    const ownerId = ownerIdFromReq(req, res);
    if (!ownerId) return;
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const purchase = await Purchase.findOne({ _id: req.params.id, createdBy: ownerId });
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    const next = await Installment.findOne({ purchaseId: purchase._id, status: 'pending' }).sort({ sequence: 1 });
    if (!next) return res.status(400).json({ message: 'All installments already paid' });

    next.status = 'paid';
    await next.save();

    const remaining = await Installment.countDocuments({ purchaseId: purchase._id, status: 'pending' });
    if (remaining === 0) {
      purchase.status = 'completed';
      await purchase.save();
    }

    res.json({ message: 'Installment paid', installment: next });
  } catch (err: any) {
    log.error('Pay installment failed', { error: err.message });
    res.status(500).json({ message: 'Unable to pay installment' });
  }
};