import axios from 'axios';
import {BASE_URL} from './config';

export const getAllCategories = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/categories`);
    return res.data;
  } catch (error) {
    console.log('Error fetching categories: ', error);
    return [];
  }
};

export const getProductByCategoryId = async (id: string) => {

  try {
    const res = await axios.get(`${BASE_URL}/product/${id}`);
    return res.data;
    
  } catch (error) {
    console.log('Error fetching product by category id', error);
    return [];
  }
};
