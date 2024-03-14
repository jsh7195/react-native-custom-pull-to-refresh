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
}
const PullToRefreshFlatList = forwardRef<FlatList, IPullToRefreshComponentProps>((props, ref) => {

    const scrollY = useSharedValue(0);
    const enablePullToRefresh = useSharedValue(true);

    const scrollRef = React.useRef(null);

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

    // JS thread 에서 수행하는 원상복귀 애니메이션 (script에서 수행해야할 때)
    const handleRefreshCompleteRefrshApi = () => {
        'worklet';
        runOnJS(refreshApi)();
        runOnJS(setTimeout)(timeoutFunction, 1500);
    };

    // refetch 필요없는 complete
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

    // --------- reload animation ---------
    //expand wrap 
    const loadingWrapAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: enablePullToRefresh.value ? interpolate(scrollY.value, [0, THRESHOLD], [0, THRESHOLD], 'clamp') : 0,
        };
    });

    // wrap
    const wrapAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: enablePullToRefresh.value ? interpolate(scrollY.value, [0, THRESHOLD], [0, THRESHOLD], 'clamp') : 0,
        };
    });

    // text in wrap
    const loadingTextAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: enablePullToRefresh.value ? interpolate(scrollY.value, [0, THRESHOLD], [0, 1], 'clamp') : 0,
            height: enablePullToRefresh.value ? interpolate(scrollY.value, [0, THRESHOLD], [0, THRESHOLD], 'clamp') : 0,
        };
    });

    // img in wrap
    const loadingImageAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: enablePullToRefresh.value ? interpolate(scrollY.value, [0, THRESHOLD], [0, 1], 'clamp') : 0,
        };
    });

    // 본문내용 + 새로고침 컴포넌트
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
                    <Animated.View style={[wrapAnimatedStyle, { paddingHorizontal: (20), paddingTop: (29), paddingBottom: (32), flexDirection: 'row' }]}>
                        <Animated.View style={[loadingTextAnimatedStyle, { marginRight: (40) }]}>
                            <Animated.Text style={[{ color: '#FFFFFF', paddingBottom: (15), fontSize: (12), fontWeight: '800', letterSpacing: -0.4 }]}>Image or your Component</Animated.Text>
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
});

export default PullToRefreshFlatList;
