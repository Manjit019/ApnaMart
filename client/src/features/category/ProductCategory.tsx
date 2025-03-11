import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '@components/ui/CustomHeader';
import {Colors} from '@utils/Constants';
import Sidebar from './Sidebar';
import {
  getAllCategories,
  getProductByCategoryId,
} from '@service/productService';
import ProductList from './ProductList';
import withCart from '@features/cart/withCart';
import {useRoute} from '@react-navigation/native';

const ProductCategory = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);

  const route = useRoute();
  const clickedCategory = route?.params as Record<string, any>;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getAllCategories();
        setCategories(data);

        if (data && data.length > 0) {
          const paramsCate = data.find(
            (c: any) => c?.name == clickedCategory?.name,
          );
          if (paramsCate) {
            setSelectedCategory(paramsCate);
          } else {
            setSelectedCategory(data[0]);
          }
        }
      } catch (error) {
        console.log('Error loading categories', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);


  useEffect(() => {
    const fetchProducts = async (categoryId: string) => {
      try {
        setProductsLoading(true);
        const data = await getProductByCategoryId(categoryId);
        setProducts(data);
      } catch (error) {
        console.log('Error fetching products', error);
      } finally {
        setProductsLoading(false);
      }
    };

    if (selectedCategory?._id) {
      fetchProducts(selectedCategory._id);
    }
  }, [selectedCategory]);

  return (
    <View style={styles.mainContainer}>
      <CustomHeader title={selectedCategory?.name || 'Categories'} search />
      <View style={styles.subContainer}>
        {categoriesLoading ? (
          <ActivityIndicator size="small" color={Colors.border} />
        ) : (
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryPress={(category: any) => setSelectedCategory(category)}
          />
        )}
        {productsLoading ? (
          <ActivityIndicator size="small" color={Colors.border} />
        ) : (
          <ProductList data={products || []} />
        )}
      </View>
    </View>
  );
};

export default withCart(ProductCategory);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
