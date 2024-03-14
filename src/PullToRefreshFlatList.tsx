import React, { forwardRef, useCallback } from 'react';
import { FlatList, FlatListProps, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, withTiming, Easing, runOnJS } from 'react-native-reanimated';

import PullToRefreshAOS from './PullToRefreshAOS';
import PullToRefreshIOS from './PullToRefreshIOS';

const THRESHOLD = Platform.OS === 'ios' ? (130) : (130);
interface IPullToRefreshComponentProps extends Omit<FlatListProps<any>, 'data' | 'renderItem' | 'ListHeaderComponent'> {
    onRefresh: () => void;
    onScroll?: any;
    data?: any[];
    renderItem?: any;
    ListHeaderComponent?: any;
    refreshComponent?: any;
}
const PullToRefreshFlatList = (props:IPullToRefreshComponentProps) => {
    const scrollY = useSharedValue(0);
    const enablePullToRefresh = useSharedValue(true);
    const scrollRef = useRef(null);

    const timeoutFunction = () => {
        scrollY.value = withTiming(
            0,
            {
                duration: 200,
                easing: Easing.linear,
            },
            isFinish => {
                if (isFinish) {
                    if (!enablePullToRefresh.value) {
                        enablePullToRefresh.value = true;
                    }
                }
            },
        );
    };

    const refreshApi = () => {
        if (props.onRefresh) {
            props.onRefresh();
        }
    };

    const handleRefreshCompleteRefrshApi = () => {
        'worklet';
        runOnJS(refreshApi)();
        runOnJS(setTimeout)(timeoutFunction, 1500);
    };

    const handleRefreshComplete = () => {
        'worklet';
        scrollY.value = withTiming(
            0,
            {
                duration: 200,
                easing: Easing.linear,
            },
            isFinish => {
                if (isFinish) {
                    if (!enablePullToRefresh.value) {
                        enablePullToRefresh.value = true;
                    }
                }
            },
        );
    };

    const loadingWrapAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: enablePullToRefresh.value ? interpolate(scrollY.value, [0, THRESHOLD], [0, THRESHOLD], 'clamp') : 0,
        };
    });

    const wrapAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: enablePullToRefresh.value ? interpolate(scrollY.value, [0, THRESHOLD], [0, THRESHOLD], 'clamp') : 0,
        };
    });

    const loadingTextAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: enablePullToRefresh.value ? interpolate(scrollY.value, [0, THRESHOLD], [0, 1], 'clamp') : 0,
            height: enablePullToRefresh.value ? interpolate(scrollY.value, [0, THRESHOLD], [0, THRESHOLD], 'clamp') : 0,
        };
    });

    const loadingImageAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: enablePullToRefresh.value ? interpolate(scrollY.value, [0, THRESHOLD], [0, 1], 'clamp') : 0,
        };
    });

    const _ListHeaderComponent = useCallback(() => {
        return (
            <Animated.View>
                <Animated.View
                    style={[
                        loadingWrapAnimatedStyle,
                        {
                            backgroundColor: 'red',
                            overflow: 'hidden',
                        },
                    ]}>
                    <Animated.View style={[wrapAnimatedStyle, { paddingHorizontal: 20, paddingTop: 29, paddingBottom: 32, flexDirection: 'row' }]}>
                        <Animated.View style={[loadingTextAnimatedStyle, { marginRight: 40 }]}>
                            <Animated.Text style={{ color: '#FFFFFF', paddingBottom: 15, fontSize: 12, fontWeight: '800', letterSpacing: -0.4 }}>Image or your Component</Animated.Text>
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
                {props?.ListHeaderComponent}
            </Animated.View>
        );
    }, [props.ListHeaderComponent]); 

    const _config = {
        scrollY,
        THRESHOLD,
        _ListHeaderComponent,
        handleRefreshCompleteRefrshApi,
        handleRefreshComplete,
        enablePullToRefresh,
        ...props,
    };

    return Platform.OS === 'ios' ? <PullToRefreshIOS scrollRef={scrollRef} {..._config} /> : <PullToRefreshAOS scrollRef={scrollRef} {..._config} />;
};

export default PullToRefreshFlatList;
function useRef(arg0: null) {
    throw new Error('Function not implemented.');
}

