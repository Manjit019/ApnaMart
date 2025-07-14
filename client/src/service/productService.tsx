import axios from 'axios';
import { BASE_URL } from './config';

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


export const searchProducts = async (query: string, page: number, sort?: string, order?: string, maxPrice?: number, minPrice?: number, brand?: string,limit?: number,) => {

  try {
    console.log( query,
        page,
        sort,
        order,
        maxPrice,
        minPrice,
        brand);
    const res = await axios.get(`${BASE_URL}/product/search`, {
      params: {
        q: query,
        page,
        limit: 10,
        sort,
        order,
        maxPrice,
        minPrice,
        brand
      }
    });

    return res.data;

  } catch (error) {
    console.log('Error fetching products : ', error);
    return [];
  }
}