import React, {forwardRef, useCallback, useImperativeHandle} from 'react';
import {FlatList, FlatListProps, Platform} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

import PullToRefreshAOS from './PullToRefreshAOS';
import PullToRefreshIOS from './PullToRefreshIOS';

interface IPullToRefreshComponentProps
  extends Omit<
    FlatListProps<any>,
    'data' | 'renderItem' | 'ListHeaderComponent'
  > {
  onRefresh: () => void;
  onScroll?: any;
  data?: any[];
  renderItem?: any;
  ListHeaderComponent?: any;
  refreshComponent?: any;
  THRESHOLD: number;
  refreshPosition?: 'top' | 'down';
}
interface IPullToRefreshFunction {
  goTop: () => void;
}

const PullToRefreshFlatList = forwardRef<
  IPullToRefreshFunction,
  IPullToRefreshComponentProps
>((props, ref) => {
  const {THRESHOLD, refreshPosition = 'top'} = props;
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

  // --------- 새로고침 컴포넌트 애니메이션 ---------
  //wrap 펼칠 때
  const loadingWrapAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: enablePullToRefresh.value
        ? interpolate(scrollY.value, [0, THRESHOLD], [0, THRESHOLD], 'clamp')
        : 0,
    };
  });

  // wrap
  const wrapAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: enablePullToRefresh.value
        ? interpolate(scrollY.value, [0, THRESHOLD], [0, 1], 'clamp')
        : 0,
      height: enablePullToRefresh.value
        ? interpolate(scrollY.value, [0, THRESHOLD], [0, THRESHOLD], 'clamp')
        : 0,
    };
  });

  const _ListHeaderComponent = useCallback(() => {
    return (
      <Animated.View>
        {refreshPosition === 'down' && props?.ListHeaderComponent}
        <Animated.View
          style={[
            loadingWrapAnimatedStyle,
            {
              overflow: 'hidden',
            },
          ]}>
          <Animated.View style={[wrapAnimatedStyle]}>
            {props.refreshComponent ? (
              props.refreshComponent
            ) : (
              <Animated.Text
                style={[
                  {
                    color: 'black',
                    paddingBottom: 15,
                    fontSize: 12,
                    fontWeight: '800',
                    letterSpacing: -0.4,
                  },
                ]}>
                Custom Components
              </Animated.Text>
            )}
          </Animated.View>
        </Animated.View>
        {refreshPosition === 'top' && props?.ListHeaderComponent}
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

  const goTop = () => {
    setTimeout(
      () => scrollRef.current?.scrollToOffset({animated: true, offset: 0}),
      100,
    );
  };

  useImperativeHandle(ref, () => ({
    goTop,
  }));

  return Platform.OS === 'ios' ? (
    <PullToRefreshIOS scrollRef={scrollRef} {..._config} />
  ) : (
    <PullToRefreshAOS scrollRef={scrollRef} {..._config} />
  );
});

export default PullToRefreshFlatList;
