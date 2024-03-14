import React, { useRef } from 'react';
import { View } from 'react-native';
import Animated, { runOnJS, useAnimatedScrollHandler } from 'react-native-reanimated';
import { Gesture, GestureDetector, FlatList } from 'react-native-gesture-handler';

const PullToRefreshIOS = props => {
    const { scrollRef, _ListHeaderComponent, onScroll, handleRefreshCompleteRefrshApi, handleRefreshComplete, scrollY, THRESHOLD, enablePullToRefresh } = props;

    const panRef = useRef();
    const nativeRef = useRef();

    const panGesture = Gesture.Pan()
        .manualActivation(false)
        .minPointers(1)
        .onTouchesDown((event, stateManager) => {})
   
        .onUpdate(event => {
            scrollY.value = event.translationY;
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
        .failOffsetX([-50000,50000])
        .failOffsetY([0,50000])
        .simultaneousWithExternalGesture(nativeRef)
        .withRef(panRef);

    const nativeGesture = Gesture.Native().simultaneousWithExternalGesture(panRef).withRef(nativeRef);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event, ctx) => {
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
            <View style={{ flex: 1 }}>
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
                        style={{ flex: 1, zIndex: 2, top: 0 }}
                        contentContainerStyle={props.contentContainerStyle}
                        data={props.data}
                        renderItem={props.renderItem}
                        ListHeaderComponent={<_ListHeaderComponent />}
                    />
                </GestureDetector>
            </View>
        </GestureDetector>
    );
};

export default PullToRefreshIOS;
