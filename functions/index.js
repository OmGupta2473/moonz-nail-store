const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { amount, currency = 'INR', receipt } = data;

  try {
    const response = await axios.post(
      'https://api.razorpay.com/v1/orders',
      { amount, currency, receipt },
      {
        auth: {
          username: functions.config().razorpay.key_id,
          password: functions.config().razorpay.key_secret
        }
      }
    );

    return { orderId: response.data.id };
  } catch (error) {
    console.error('Order creation failed:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create order');
  }
});

exports.verifyRazorpayPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
  const crypto = require('crypto');

  const secret = functions.config().razorpay.key_secret;
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

  if (expectedSignature === razorpay_signature) {
    return { status: 'success', paymentId: razorpay_payment_id };
  } else {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid signature');
  }
});