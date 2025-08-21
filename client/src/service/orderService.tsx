import RazorpayCheckout, { CheckoutOptions } from 'react-native-razorpay';
import { appAxios } from './apiInterceptors';
import { BRANCH_ID } from './config';
import { navigate, resetAndNavigate } from '@utils/NavigationUtils';
import { Colors } from '@utils/Constants';


interface OrderItem {
  id: string | number;
  item: string;
  count: number
}

interface DeliveryLocation {
  latitude?: number;
  longitude?: number;
  address?: string;
}

interface CreateOrderResponse {
  type?: 'error' | 'success';
  message?: string;
  order?: any;
}

export const createOrder = async (
  items: OrderItem[],
  totalPrice: number,
  coupon?: any,
  deliveryLocation?: DeliveryLocation,
  discount?: number,
  finalTotal?: number,
  paymentMode?: 'COD' | 'Online',
  key?: string,
  order_id?: string,
  method?: string,
  notes?: string,
): Promise<CreateOrderResponse | null> => {
  try {
    // Input validation
    if (!items || items.length === 0) {
      return { type: 'error', message: 'No items provided' };
    }

    if (!totalPrice || totalPrice <= 0) {
      return { type: 'error', message: 'Invalid total price' };
    }

    if (!paymentMode) {
      return { type: 'error', message: 'Payment mode is required' };
    }

    const calculatedFinalTotal = finalTotal || totalPrice;

    if (paymentMode === 'Online') {
      // Validation for online payment
      if (!key || !order_id) {
        return { type: 'error', message: 'Payment credentials missing' };
      }

      const options: CheckoutOptions = {
        description: "Grocery Shopping",
        image: "https://res.cloudinary.com/dkp5txigu/image/upload/v1741696157/app_icon_jra1d5.jpg",
        currency: "INR",
        key: key,
        amount: calculatedFinalTotal * 100, // Convert to paise for Razorpay
        name: "ApnaMart",
        order_id: order_id,
        theme: {
          color: Colors.secondary
        },
      };

      try {
        const razorpayData = await RazorpayCheckout.open(options);

        const orderPayload = {
          items: items,
          branch: BRANCH_ID,
          totalPrice: totalPrice,
          coupon,
          deliveryLocation,
          discount: discount || 0,
          finalTotal: calculatedFinalTotal,
          razorpay_order_id: order_id,
          razorpay_payment_id: razorpayData?.razorpay_payment_id,
          razorpay_signature: razorpayData?.razorpay_signature,
          method,
          notes,
          paymentMode
        };

        const res = await appAxios.post('/order', orderPayload);

        if (res.data?.success) {
          const orderData = res.data?.order;
          navigate('OrderSuccess', { orderDetails: orderData, isPayment: false });
          return { type: 'success', order: orderData };
        } else {
          return { type: 'error', message: res.data?.message || 'Order creation failed' };
        }

      } catch (razorpayError) {
        console.log('Razorpay Error:', razorpayError);
        return { type: 'error', message: 'Payment cancelled or failed' };
      }

    } else if (paymentMode === 'COD') {
      const orderPayload = {
        items: items,
        branch: BRANCH_ID,
        totalPrice: totalPrice,
        coupon,
        deliveryLocation,
        discount: discount || 0,
        finalTotal: calculatedFinalTotal,
        paymentMode
      };

      const res = await appAxios.post('/order', orderPayload);

      if (res.data?.success) {
        const orderData = res.data?.order;
        navigate('OrderSuccess', { orderDetails: orderData, isPayment: false });
        return { type: 'success', order: orderData };
      } else {
        return { type: 'error', message: res.data?.message || 'Order creation failed' };
      }
    }

    return { type: 'error', message: 'Invalid payment mode' };

  } catch (error) {
    console.log('Error creating order:', error);
    return { type: 'error', message: 'Failed to create order. Please try again.' };
  }
};

export const getOrderById = async (id: string) => {
  try {
    if (!id) {
      console.log('Order ID is required');
      return null;
    }

    const res = await appAxios.get(`/order/${id}`);
    return res.data;
  } catch (error) {
    console.log('Error fetching order:', error);
    return null;
  }
};

export const fetchCustomerOrders = async (userId: string) => {
  try {
    if (!userId) {
      console.log('User ID is required');
      return null;
    }

    const res = await appAxios.get(`/order/?customerId=${userId}`);
    return res.data;
  } catch (error) {
    console.log('Error fetching customer orders:', error);
    return null;
  }
};

export const fetchOrders = async (
  status: string,
  userId: string,
  branchId: string,
) => {
  // Input validation
  if (!status || !userId || !branchId) {
    console.error('Missing required parameters');
    return null;
  }

  const validStatuses = ['all', 'available', 'confirmed', 'arriving', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    console.error(`Invalid status: ${status}`);
    return null;
  }

  let uri: string = '';
  const encodedBranchId = encodeURIComponent(branchId);
  const encodedUserId = encodeURIComponent(userId);

  switch (status) {
    case 'all':
      uri = `/order/?branchId=${encodedBranchId}`;
      break;
    case 'available':
      uri = `/order/?status=${encodeURIComponent(status)}&branchId=${encodedBranchId}`;
      break;
    case 'confirmed':
    case 'arriving':
    case 'delivered':
    case 'cancelled':
      uri = `/order/?branchId=${encodedBranchId}&deliveryPartnerId=${encodedUserId}&status=${encodeURIComponent(status)}`;
      break;
    default:
      console.error(`Unhandled status: ${status}`);
      return null;
  }

  try {
    const response = await appAxios.get(uri);
    return response.data;
  } catch (error) {
    console.log('Error fetching delivery orders:', error);
    return null;
  }
};

export const confirmOrder = async (id: string, location: DeliveryLocation) => {
  try {
    if (!id) {
      console.log('Order ID is required');
      return null;
    }

    if (!location || (typeof location.latitude !== 'number' || typeof location.longitude !== 'number')) {
      console.log('Valid location is required');
      return null;
    }

    const res = await appAxios.post(`/order/${id}/confirm`, {
      deliveryPersonLocation: location,
    });
    return res.data;
  } catch (error) {
    console.log('Error confirming order:', error);
    return null;
  }
};

export const sendLiveOrderUpdates = async (
  id: string,
  location: DeliveryLocation,
  status: string,
) => {
  try {
    if (!id || !status) {
      console.log('Order ID and status are required');
      return null;
    }

    if (!location || (typeof location.latitude !== 'number' || typeof location.longitude !== 'number')) {
      console.log('Valid location is required');
      return null;
    }

    const validStatuses = ['confirmed', 'arriving', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      console.log('Invalid status provided');
      return null;
    }

    const res = await appAxios.patch(`/order/${id}/status`, {
      deliveryPersonLocation: location,
      status,
    });
    return res.data;
  } catch (error) {
    console.log('Send live order updates error:', error);
    return null;
  }
};

export const makeOrderPayment = async (orderId: string, key: string, order_id: string, amount: number) => {

  if (!key || !order_id) {
    return { type: 'error', message: 'Payment credentials missing' };
  }

  const options: CheckoutOptions = {
    description: "Grocery Shopping",
    image: "https://res.cloudinary.com/dkp5txigu/image/upload/v1741696157/app_icon_jra1d5.jpg",
    currency: "INR",
    key: key,
    amount: amount * 100, // Convert to paise for Razorpay
    name: "ApnaMart",
    order_id: order_id,
    theme: {
      color: Colors.secondary
    },
  };

  try {
    const razorpayData = await RazorpayCheckout.open(options);

    const orderPayload = {
      razorpay_order_id: order_id,
      razorpay_payment_id: razorpayData?.razorpay_payment_id,
      razorpay_signature: razorpayData?.razorpay_signature,
      orderId
    };

    const res = await appAxios.post('/order/makePayment', orderPayload);

    if (res.data?.success) {
      const orderData = res.data?.order;
      navigate('OrderSuccess', { orderDetails: orderData, isPayment: true });

      return { type: 'success', order: orderData };
    } else {
      return { type: 'error', message: res.data?.message || 'Order creation failed' };
    }

  } catch (razorpayError) {
    console.log('Razorpay Error:', razorpayError);
    return { type: 'error', message: 'Payment cancelled or failed' };
  }
}