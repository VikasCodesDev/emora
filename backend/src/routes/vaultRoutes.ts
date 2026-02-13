import express from 'express';
import {
  getVaultContent,
  saveToVault,
  deleteFromVault,
  getVaultAnalytics,
} from '../controllers/vaultController';
import { protect } from '../middleware/auth';
import { validate, saveContentSchema } from '../middleware/validation';

const router = express.Router();

// All vault routes are protected
router.use(protect);

router.get('/', getVaultContent);
router.post('/save', validate(saveContentSchema), saveToVault);
router.delete('/:id', deleteFromVault);
router.get('/analytics', getVaultAnalytics);

export default router;
