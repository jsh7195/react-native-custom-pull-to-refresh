import React, { useRef } from 'react';
import Animated, { useAnimatedGestureHandler, useSharedValue } from 'react-native-reanimated';
import { PanGestureHandler, FlatList, Gesture, GestureDetector } from 'react-native-gesture-handler';

const PullToRefreshAOS = props => {
    const { _ListHeaderComponent, handleRefreshCompleteRefrshApi, handleRefreshComplete, scrollY, THRESHOLD, scrollRef } = props;

    const panRef = useRef();

    const enablePullToRefresh = useSharedValue(true);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (event, context) => {
            context.startY = event.translationY;
        },
        onActive: (event, context) => {
            scrollY.value = event.translationY;
        },
        onEnd: (event, context) => {
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
        <PanGestureHandler enabled={enablePullToRefresh.value} onGestureEvent={gestureHandler} activeOffsetY={[THRESHOLD * -1, 5]} failOffsetY={[0,50000]} failOffsetX={[-50000, 50000]} ref={panRef} simultaneousHandlers={[panRef, scrollRef]}>
            <Animated.View style={{ flex: 1 }}>
                <Animated.FlatList
                    ref={scrollRef}
                    onRefresh={undefined}
                    refreshing={false}
                    scrollEventThrottle={16}
                    onScroll={event => {
                        if (event.nativeEvent.contentOffset.y === 0) {
                            if (panRef.current) {
                                enablePullToRefresh.value = true;
                                (panRef.current as any).setNativeProps({ enabled: true });
                            }
                        } else {
                            if (panRef.current) {
                                enablePullToRefresh.value = false;
                                (panRef.current as any).setNativeProps({ enabled: false });
                            }
                        }
                        if (props.onScroll) {
                            props.onScroll(event.nativeEvent);
                        }
                    }}
                    overScrollMode={'never'}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, zIndex: 2, top: 0 }}
                    contentContainerStyle={props.contentContainerStyle}
                    data={props.data}
                    keyExtractor={props.keyExtractor}
                    renderItem={props.renderItem}
                    ListHeaderComponent={<_ListHeaderComponent />
                }
                />
            </Animated.View>
        </PanGestureHandler>
    );
};

export default PullToRefreshAOS;
