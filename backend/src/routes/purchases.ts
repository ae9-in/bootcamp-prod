import { Router } from 'express';
import { Purchase } from '../models/Purchase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find().populate('userId', 'name email');
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { durationType, durationValue, totalPrice, userId, userName } = req.body;
    const purchase = new Purchase({
      durationType,
      durationValue,
      totalPrice,
      userId,
      userName
    });
    await purchase.save();
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.params.userId });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
});

export default router;