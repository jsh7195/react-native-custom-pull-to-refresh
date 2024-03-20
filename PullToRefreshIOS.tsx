import React, {useRef} from 'react';
import {View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import { IPullToRefreshChild } from './PullToRefresh';
const PullToRefreshIOS = (props: IPullToRefreshChild) => {
  const {
    scrollRef,
    ListHeaderComponent,
    onScroll,
    handleRefreshCompleteRefrshApi,
    handleRefreshComplete,
    scrollY,
    THRESHOLD,
    enablePullToRefresh,
    contentContainerStyle,
    data,
    renderItem,
    keyExtractor,
  } = props;

  const panRef = useRef();
  const nativeRef = useRef();

  const panGesture = Gesture.Pan()
    .manualActivation(false)
    .minPointers(1)
    .onTouchesDown((event, stateManager) => {})
    .onUpdate(event => {
      scrollY.value = event.translationY;
    })
    .onEnd(() => {
      if (enablePullToRefresh.value) {
        if (scrollY.value > THRESHOLD + 5) {
          handleRefreshCompleteRefrshApi();
        } else {
          handleRefreshComplete();
        }
      }
    })
    .activeOffsetY([THRESHOLD * -1, 5])
    .failOffsetX([-50000, 50000])
    .failOffsetY([0, 50000])
    .simultaneousWithExternalGesture(nativeRef)
    .withRef(panRef);

  const nativeGesture = Gesture.Native()
    .simultaneousWithExternalGesture(panRef)
    .withRef(nativeRef);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      if (event.contentOffset.y <= 0) {
        enablePullToRefresh.value = true;
        scrollY.value = 0;
      } else {
        enablePullToRefresh.value = false;
        scrollY.value = event.contentOffset.y;
      }
      if (onScroll) {
        runOnJS(onScroll)(event);
      }
    },
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={{flex: 1}}>
        <GestureDetector gesture={nativeGesture}>
          <Animated.FlatList
            ref={scrollRef}
            onRefresh={undefined}
            refreshing={false}
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            overScrollMode={'never'}
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={contentContainerStyle}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={<ListHeaderComponent />}
          />
        </GestureDetector>
      </View>
    </GestureDetector>
  );
};

export default PullToRefreshIOS;
