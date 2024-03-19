/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

import PullToRefreshFlatList from './src/PullToRefreshFlatList';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const iphoneData = [
  {
    id: '15',
    model: 'iPhone 15',
    description:
      'The iPhone 15 pushes the boundaries of technology with its advanced features.',
  },
  {
    id: '14',
    model: 'iPhone 15 Pro',
    description:
      'The iPhone 15 Pro offers professional-level photography with its superior camera system.',
  },
  {
    id: '13',
    model: 'iPhone 14',
    description:
      'The iPhone 14 introduces an all-new design and next-level performance.',
  },
  {
    id: '12',
    model: 'iPhone 14 Pro',
    description:
      'The iPhone 14 Pro features a cutting-edge display technology and camera improvements.',
  },
  {
    id: '11',
    model: 'iPhone 13',
    description:
      'The iPhone 13 features an even brighter OLED display and the A15 Bionic chip.',
  },
  {
    id: '10',
    model: 'iPhone 13 Pro',
    description:
      'The iPhone 13 Pro brings new capabilities to professional photography and video.',
  },
  {
    id: '9',
    model: 'iPhone 12',
    description:
      'The iPhone 12 features the first 5G technology and a new Ceramic Shield front cover.',
  },
  {
    id: '8',
    model: 'iPhone 12 Pro',
    description:
      'The iPhone 12 Pro offers a powerful photography system and 5G speeds.',
  },
  {
    id: '7',
    model: 'iPhone 11',
    description:
      'The iPhone 11 features a dual-camera system for ultra wide photos.',
  },
  {
    id: '6',
    model: 'iPhone 11 Pro',
    description:
      'The iPhone 11 Pro features a triple-camera system for professional-level photos.',
  },
  {
    id: '5',
    model: 'iPhone XS Max',
    description: 'The iPhone XS Max features a 6.5-inch Super Retina display.',
  },
  {
    id: '4',
    model: 'iPhone XS',
    description: 'The iPhone XS features a 5.8-inch Super Retina display.',
  },
  {
    id: '3',
    model: 'iPhone XR',
    description: 'The iPhone XR features a 6.1-inch Liquid Retina display.',
  },
  {
    id: '2',
    model: 'iPhone X',
    description: 'The iPhone X features a new all-screen design.',
  },
  {
    id: '1',
    model: 'iPhone 8 Plus',
    description:
      'The iPhone 8 Plus features dual cameras for extraordinary photos.',
  },
  {
    id: '0',
    model: 'iPhone 8',
    description: 'The iPhone 8 introduces a new glass design.',
  },
];

function App(): React.JSX.Element {
  const ListHeaderComponent = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>ListHeaderComponent</Text>
      </View>
    );
  };

  const Item = ({model, description}) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemModel}>{model}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
    );
  };

  const renderItem = ({item}) => (
    <Item model={item.model} description={item.description} />
  );

  const SimpleRefreshComponent = () => {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Refetch ...</Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1, paddingTop: 80, paddingBottom: 35}}>
      <GestureHandlerRootView style={{flex: 1}}>
        <PullToRefreshFlatList
          THRESHOLD={150}
          onRefresh={() => console.log('refresh')}
          data={iphoneData}
          renderItem={renderItem}
          refreshPosition={'top'}
          keyExtractor={item => item.id}
          ListHeaderComponent={ListHeaderComponent}
          RefreshComponent={SimpleRefreshComponent}
        />
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20, // 패딩을 주어 텍스트 주변에 여백을 만듭니다.
    backgroundColor: '#f0f0f0', // 배경색을 설정합니다.
    alignItems: 'center', // 텍스트를 가운데 정렬합니다.
  },
  headerText: {
    fontSize: 16, // 폰트 크기를 설정합니다.
    fontWeight: 'bold', // 폰트 무게를 굵게 설정합니다.
  },
  itemContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemModel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  container: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0', // 배경색 설정
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000', // 그림자 색
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold', // 글씨 굵게
    color: '#0000ff',
  },
});

export default App;
