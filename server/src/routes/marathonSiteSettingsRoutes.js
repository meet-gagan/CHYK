import express from 'express';
import {
  getMarathonSiteSettings,
  updateMarathonSiteSettings,
  toggleMarathonSiteSettings,
} from '../controllers/marathonSiteSettingsController.js';

const router = express.Router();

router.get('/', getMarathonSiteSettings);
router.get('/status', getMarathonSiteSettings);
router.put('/', updateMarathonSiteSettings);
router.post('/', updateMarathonSiteSettings);
router.post('/toggle', toggleMarathonSiteSettings);

export default router;

