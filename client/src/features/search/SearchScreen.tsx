import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Colors, Fonts } from '@utils/Constants'
import SearchBar from './SearchBar'
import Icon from 'react-native-vector-icons/Ionicons'
import { RFValue } from 'react-native-responsive-fontsize'
import { goBack } from '@utils/NavigationUtils'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { searchProducts } from '@service/productService'
import ProductItem from '@features/category/ProductItem'
import CustomText from '@components/ui/CustomText'
import { screenHeight } from '@utils/Scaling'
import FilterSort from './FilterSort'


const SearchScreen = () => {

  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [sortby, setSortBy] = useState<string>('relevance');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    if (query.length >= 2) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fetchProducts(1, true)
      }, 500);

    }
  }, [query, sortby, order])




  const fetchProducts = async (pageNo = 1, reset = false) => {

    if (loading || (!hasMore && !reset)) return;
    setLoading(true);

    const data = await searchProducts(query, pageNo, sortby, order);

    console.log(data);

    setProducts(prev => reset ? data?.products : [...prev, ...data?.products]);

    setPage(pageNo + 1);
    setHasMore(data?.products?.length === 10);
    setLoading(false)
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchProducts(page);
    }
  }

  const renderSearchItem = ({ item, index }: any) => {
    console.log(item);
    return <ProductItem item={item} index={index} />
  }

  return (
    <View style={[styles.container,]}>

      <View style={[styles.searchHeader, styles.flexRowBetween, { paddingTop: insets.top + 8 }]}>

        <TouchableOpacity activeOpacity={0.8} onPress={() => goBack()} >
          <Icon name='arrow-back-circle' size={RFValue(28)} color={'#fff'} />
        </TouchableOpacity>

        <SearchBar onSetQuery={setQuery} query={query} onClear={() => {
          setQuery('');
        }} />

      </View>

      <FlatList
        data={products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSearchItem}
        contentContainerStyle={styles.resultContainer}
        ListFooterComponent={loading ? <ActivityIndicator style={{ marginTop: 10 }} /> : null}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <CustomText style={{ marginVertical: 20 }}>
            Showning result for <CustomText fontFamily={Fonts.SemiBold} style={{ textTransform: 'uppercase' }} >{query}</CustomText>
          </CustomText>
        }
        ListHeaderComponentStyle={query?.length > 0 || loading ? { opacity: 100 } : { opacity: 0 }}
        numColumns={2}

        ListEmptyComponent={
          <View style={styles.emptyContent}>
            <CustomText fontFamily={Fonts.SemiBold} style={{ opacity: 0.7 }}>
              {query.length < 1 ? "LET'S START SEARCHING..." : " NO PRODUCT FOUND"}
            </CustomText>
          </View>
        }
      />

      {products.length > 1 && (
        <FilterSort />
      )}

    </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary
  },
  searchHeader: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: Colors.primary
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  resultContainer: {
    padding: 5,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight * 0.6
  }
})