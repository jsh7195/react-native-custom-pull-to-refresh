import React, {useRef} from 'react';
import {View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedReaction,
  useSharedValue
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
  const isScrolling = useSharedValue<boolean>(false);

  const panGesture = Gesture.Pan()
  .manualActivation(false)
  .minPointers(1)
  .onTouchesDown((event, stateManager) => {})
  .onUpdate(event => {
      if (enablePullToRefresh.value) {
          scrollY.value = event.translationY;
      }
  })
  .onEnd(event => {
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
      onScroll: (event, ctx) => {
          if (event.contentOffset.y <= 0) {
              scrollY.value = 0;
          } else {
              enablePullToRefresh.value = false;
              scrollY.value = event.contentOffset.y;
          }
          if (onScroll) {
              runOnJS(onScroll)(event);
          }
      },
      onBeginDrag: () => {
          isScrolling.value = true;
      },
      onEndDrag: () => {
          isScrolling.value = false;
      },
  });

  useAnimatedReaction(
    () => ({
        value1: scrollY.value,
        value2: isScrolling.value,
    }),
    values => {
        if (values.value1 === 0 && !values.value2) {
            enablePullToRefresh.value = true;
        }
    },
);

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

export { PullToRefreshIOS }