import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import CustomText from '@components/ui/CustomText';
import {Colors, Fonts} from '@utils/Constants';

interface TabBarProps {
  selectedTab: 'available'|'confirmed'|'arriving' | 'delivered' |'cancelled';
  onTabChange: (tab: 'available'|'confirmed'|'arriving' | 'delivered'|'cancelled' | any) => void;
}

const TABS = [ 'available', 'delivered', 'confirmed','arriving','cancelled'];

const TabBar: FC<TabBarProps> = ({onTabChange, selectedTab}) => {
  return (
    <View style={[{height: 'auto'}]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}>
        {TABS.map((tab, index) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              style={[styles.tab, selectedTab == tab && styles.active]}
              onPress={() => onTabChange(tab)}>
              <CustomText
                variant="h7"
                fontFamily={Fonts.SemiBold}
                style={[
                  styles.tabText,
                  selectedTab == tab
                    ? styles.activeTabText
                    : styles.inactiveTabText,{textTransform : 'capitalize'}
                ]}>
                {tab==='arriving' ? 'Picked Up' : tab}
              </CustomText>
            </TouchableOpacity>
          );
        })}
   
      </ScrollView>
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-around',
    // marginBottom: 10,
    // padding: 10,
  },
  tab: {
    paddingVertical: 10,
    borderRadius: 33,
    borderWidth: 2,
    margin: 10,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  active: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  tabText: {
    color: Colors.text,
  },
  activeTabText: {
    color: '#fff',
  },
  inactiveTabText: {
    color: Colors.disabled,
  },
});
