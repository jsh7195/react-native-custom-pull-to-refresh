
# Install

Required install [Reanimated](https://github.com/kmagiera/react-native-reanimated) and [React Native Gesture Handler](https://github.com/kmagiera/react-native-gesture-handler).

```
npm i react-native-custom-pull-to-refresh
```
<br /><br />

# Use lib
```
"react-native-gesture-handler": "^2.15.0",
"react-native-reanimated": "^3.6.2"
```
<br /><br />


## Props

| Name                   | Description                                                                                     | Value             |
|------------------------|-------------------------------------------------------------------------------------------------|-------------------|
| `ref` |  ref?.current?.goTop() can be used to scroll to the top of the list. | `React.ref` |
| `onRefresh`            | Function to call when the list is pulled to refresh. This function is triggered when the user pulls down the list. | `() => void`      |
| `onScroll`             | Function to handle scroll event. It can be used to perform actions during the scroll.           | `(event: NativeSyntheticEvent<NativeScrollEvent>) => void` |
| `THRESHOLD`            | The threshold height for triggering the refresh. Defaults to 150. This is the height the user must pull down to trigger the onRefresh function. | `number` (Default: 150) |
| `RefreshComponent`     | Component displayed when the list is pulled down. This could be an animation or an indicator that shows the list is being refreshed. | `React.Element`, `null`, `undefined` |
| `ListHeaderComponent`  | Optional header component for the list. This component is displayed at the top of the list.    | `React.Element`, `null`, `undefined` |
| `refreshPosition`      | Determines whether the refresh component appears above or below the ListHeaderComponent. Defaults to 'top'. | `'top'`, `'bottom'` (Default: 'top') |
| `data`                 | Data for the list. This is an array of any type that represents the data to be rendered in the list. | `any[]`           |
| `renderItem`           | Function to render each item in the data array. It defines how each item in the list should be rendered. | `any`             |
| `contentContainerStyle`| Style object for the content container. This allows for customization of the list's container style. | `any`             |
| `useOpacity`           | Opacity 0~1 when RefreshComponent Showing                                                       | `boolean`         |


<br/><br/>

## example

![Example GIF](https://github.com/jsh7195/react-native-custom-pull-to-refresh/blob/main/sample.gif?raw=true)

```

import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import PullToRefreshFlatList from 'react-native-custom-pull-to-refresh';

const iphoneData = 
[{'id': '15', 'model': 'iPhone 15', 'description': 'The iPhone 15 pushes the boundaries of technology with its advanced features.'},
{'id': '14', 'model': 'iPhone 15 Pro', 'description': 'The iPhone 15 Pro offers professional-level photography with its superior camera system.'},
{'id': '13', 'model': 'iPhone 14', 'description': 'The iPhone 14 introduces an all-new design and next-level performance.'},
{'id': '12', 'model': 'iPhone 14 Pro', 'description': 'The iPhone 14 Pro features a cutting-edge display technology and camera improvements.'},
{'id': '11', 'model': 'iPhone 13', 'description': 'The iPhone 13 features an even brighter OLED display and the A15 Bionic chip.'},
{'id': '10', 'model': 'iPhone 13 Pro', 'description': 'The iPhone 13 Pro brings new capabilities to professional photography and video.'},
{'id': '9', 'model': 'iPhone 12', 'description': 'The iPhone 12 features the first 5G technology and a new Ceramic Shield front cover.'},
{'id': '8', 'model': 'iPhone 12 Pro', 'description': 'The iPhone 12 Pro offers a powerful photography system and 5G speeds.'},
{'id': '7', 'model': 'iPhone 11', 'description': 'The iPhone 11 features a dual-camera system for ultra wide photos.'},
{'id': '6', 'model': 'iPhone 11 Pro', 'description': 'The iPhone 11 Pro features a triple-camera system for professional-level photos.'},
{'id': '5', 'model': 'iPhone XS Max', 'description': 'The iPhone XS Max features a 6.5-inch Super Retina display.'},
{'id': '4', 'model': 'iPhone XS', 'description': 'The iPhone XS features a 5.8-inch Super Retina display.'},
{'id': '3', 'model': 'iPhone XR', 'description': 'The iPhone XR features a 6.1-inch Liquid Retina display.'},
{'id': '2', 'model': 'iPhone X', 'description': 'The iPhone X features a new all-screen design.'},
{'id': '1', 'model': 'iPhone 8 Plus', 'description': 'The iPhone 8 Plus features dual cameras for extraordinary photos.'},
{'id': '0', 'model': 'iPhone 8', 'description': 'The iPhone 8 introduces a new glass design.'}]


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
        <PullToRefreshFlatList
          THRESHOLD={350}
          onRefresh={() => console.log('refresh')}
          data={iphoneData}
          renderItem={renderItem}
          refreshPosition={'top'}
          keyExtractor={item => item.id}
          ListHeaderComponent={ListHeaderComponent}
          RefreshComponent={SimpleRefreshComponent}
          useOpacity={false}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
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
    fontWeight: 'bold',
    color: '#0000ff',
  },
});

export default App;




```
<br/><br/>

# error

### - install react-native-reanimated and react-native-gesture-handler
[Reanimated](https://github.com/kmagiera/react-native-reanimated) <br/>
[React Native Gesture Handler](https://github.com/kmagiera/react-native-gesture-handler)
<br/>

### - add babel.config.js
```
  plugins: ['react-native-reanimated/plugin']
```

### - anroid animate slow
AndroidManifest.xml add android:hardwareAccelerated="true"