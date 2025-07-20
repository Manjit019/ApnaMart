import {appAxios} from './apiInterceptors';
import {BRANCH_ID} from './config';

export const createOrder = async (item: any, totalPrice: number,coupon:string,finalTotal : number) => {
  
  try {
    const res = await appAxios.post('/order', {
      items: item,
      branch: BRANCH_ID ,
      totalPrice: totalPrice,
      coupon ,
      finalTotal
    });
    return res.data;
  } catch (error) {
    console.log('Error creating order : ', error);
    return null;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const res = await appAxios.get(`/order/${id}`);
    return res.data;
  } catch (error) {
    console.log('Error fetching order : ', error);
    return null;
  }
};

export const fetchCustomerOrders = async (userId: string) => {
  try {
    const res = await appAxios.get(`/order/?customerId=${userId}`);
    return res.data;
  } catch (error) {
    console.log('Error fetching order : ', error);
    return null;
  }
};

export const fetchOrders = async (
  status: string,
  userId: string,
  branchId: string,
) => {
  let uri: string = '';

  switch (status) {
    case 'all':
      uri = `/order/?branchId=${encodeURIComponent(branchId)}`;
      break;
    case 'available':
      uri = `/order/?status=${encodeURIComponent(
        status,
      )}&branchId=${encodeURIComponent(branchId)}`;
      break;
    case 'confirmed':
      uri = `/order/?branchId=${encodeURIComponent(
        branchId,
      )}&deliveryPartnerId=${encodeURIComponent(userId)}&status=confirmed`;
      break;
    case 'arriving':
      uri = `/order/?branchId=${encodeURIComponent(
        branchId,
      )}&deliveryPartnerId=${encodeURIComponent(userId)}&status=arriving`;
      break;
    case 'delivered':
      uri = `/order/?branchId=${encodeURIComponent(
        branchId,
      )}&deliveryPartnerId=${encodeURIComponent(userId)}&status=delivered`;
      break;
    case 'cancelled':
      uri = `/order/?branchId=${encodeURIComponent(
        branchId,
      )}&deliveryPartnerId=${encodeURIComponent(userId)}&status=cancelled`;
      break;
    default:
      console.error(`Invalid status: ${status}`);
      return null;
  }

  try {
    const response = await appAxios.get(uri);
    return response.data;
  } catch (error) {
    console.log('Error Fetching delivery order : ', error);
    return null;
  }
};

export const confirmOrder = async (id: string, location: any) => {
  try {
    const res = await appAxios.post(`/order/${id}/confirm`, {
      deliveryPersonLocation: location,
    });
    return res.data;
  } catch (error) {
    console.log('Error confirming order : ', error);
    return null;
  }
};

export const sendLiveOrderUpdates = async (
  id: string,
  location: any,
  status: string,
) => {
  try {
    const res = await appAxios.patch(`/order/${id}/status`, {
      deliveryPersonLocation: location,
      status,
    });
    return res.data;
  } catch (error) {
    console.log('Send live order updates error : ', error);
    return null;
  }
};
