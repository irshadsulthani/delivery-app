import express from 'express';
import { UserController } from '../controllers/UserController';
import { handleOtpRequest, verifyOtpController } from '../controllers/otpController';

const router = express.Router();

router.post('/send-otp', handleOtpRequest)
router.post('/verify-otp', verifyOtpController )
router.post('/login', UserController.login);



export default router;
