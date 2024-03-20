import React, {useRef} from 'react';
import Animated, {useAnimatedGestureHandler} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import { IPullToRefreshChild } from '.';

const PullToRefreshAOS = (props: IPullToRefreshChild) => {
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

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startY = event.translationY;
    },
    onActive: event => {
      scrollY.value = event.translationY;
    },
    onEnd: () => {
      if (enablePullToRefresh.value) {
        if (scrollY.value > THRESHOLD + 5) {
          handleRefreshCompleteRefrshApi();
        } else {
          handleRefreshComplete();
        }
      }
    },
  });

  return (
    <PanGestureHandler
      enabled={enablePullToRefresh.value}
      onGestureEvent={gestureHandler}
      activeOffsetY={[THRESHOLD * -1, 5]}
      failOffsetY={[0, 50000]}
      failOffsetX={[-50000, 50000]}
      ref={panRef}
      simultaneousHandlers={[panRef, scrollRef]}>
      <Animated.View style={{flex: 1}}>
        <Animated.FlatList
          ref={scrollRef}
          onRefresh={undefined}
          refreshing={false}
          scrollEventThrottle={16}
          onScroll={event => {
            if (event.nativeEvent.contentOffset.y === 0) {
              if (panRef.current) {
                enablePullToRefresh.value = true;
                (panRef.current as any).setNativeProps({enabled: true});
              }
            } else {
              if (panRef.current) {
                enablePullToRefresh.value = false;
                (panRef.current as any).setNativeProps({enabled: false});
              }
            }
            if (onScroll) {
              onScroll(event.nativeEvent);
            }
          }}
          overScrollMode={'never'}
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={contentContainerStyle}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={<ListHeaderComponent />}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default PullToRefreshAOS;
