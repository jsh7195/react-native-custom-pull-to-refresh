/* eslint-disable react-native/no-inline-styles */
import React, { forwardRef, useCallback, useImperativeHandle } from "react";
import { Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

import PullToRefreshAOS from "./PullToRefreshAOS";
import PullToRefreshIOS from "./PullToRefreshIOS";
import {
  IPullToRefreshComponentProps,
  IPullToRefreshFunction,
} from "./PullRefresh";

const PullToRefreshFlatList = forwardRef<
  IPullToRefreshFunction,
  IPullToRefreshComponentProps
>((props, ref) => {
  const {
    ListHeaderComponent,
    RefreshComponent,
    THRESHOLD = 130,
    refreshPosition = "top",
    onRefresh,
    useOpacity = true,
  } = props;

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
      (isFinish) => {
        if (isFinish) {
          if (!enablePullToRefresh.value) {
            enablePullToRefresh.value = true;
          }
        }
      }
    );
  };

  const refreshApi = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  // JS thread 에서 수행하는 원상복귀 애니메이션 (script에서 수행해야할 때)
  const handleRefreshCompleteRefrshApi = () => {
    "worklet";
    runOnJS(refreshApi)();
    runOnJS(setTimeout)(timeoutFunction, 1500);
  };

  // refetch 필요없는 complete
  const handleRefreshComplete = () => {
    "worklet";
    scrollY.value = withTiming(
      0,
      {
        duration: 200,
        easing: Easing.linear,
      },
      (isFinish) => {
        if (isFinish) {
          if (!enablePullToRefresh.value) {
            enablePullToRefresh.value = true;
          }
        }
      }
    );
  };

  // --------- 새로고침 컴포넌트 애니메이션 ---------
  //wrap 펼칠 때
  const loadingWrapAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: enablePullToRefresh.value
        ? interpolate(scrollY.value, [0, THRESHOLD], [0, THRESHOLD], "clamp")
        : 0,
    };
  });

  // wrap
  const wrapAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: useOpacity
        ? enablePullToRefresh.value
          ? interpolate(scrollY.value, [0, THRESHOLD], [0, 1], "clamp")
          : 0
        : 1,
      height: enablePullToRefresh.value
        ? interpolate(scrollY.value, [0, THRESHOLD], [0, THRESHOLD], "clamp")
        : 0,
    };
  });

  const _ListHeaderComponent = useCallback(() => {
    return (
      <Animated.View>
        {refreshPosition === "bottom" && ListHeaderComponent ? (
          <ListHeaderComponent />
        ) : null}
        <Animated.View
          style={[
            loadingWrapAnimatedStyle,
            {
              overflow: "hidden",
            },
          ]}
        >
          <Animated.View style={wrapAnimatedStyle}>
            {RefreshComponent ? (
              // RefreshComponent 존재 시 직접 렌더링
              <RefreshComponent />
            ) : (
              // 기본 텍스트 렌더링
              <Animated.Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  color: "yellow",
                  backgroundColor: "green",
                  paddingBottom: 15,
                  fontSize: 12,
                  fontWeight: "800",
                  letterSpacing: -0.4,
                }}
              >
                Sample Refresh Component
              </Animated.Text>
            )}
          </Animated.View>
        </Animated.View>
        {refreshPosition === "top" && ListHeaderComponent ? (
          <ListHeaderComponent />
        ) : null}
      </Animated.View>
    );
  }, [
    RefreshComponent,
    refreshPosition,
    ListHeaderComponent,
    loadingWrapAnimatedStyle,
    wrapAnimatedStyle,
  ]);

  const _config = {
    ...props,
    scrollY,
    THRESHOLD,
    handleRefreshCompleteRefrshApi,
    handleRefreshComplete,
    enablePullToRefresh,
    ListHeaderComponent: _ListHeaderComponent,
  };

  const goTop = () => {
    setTimeout(
      () => scrollRef.current?.scrollToOffset({ animated: true, offset: 0 }),
      100
    );
  };

  useImperativeHandle(ref, () => ({
    goTop,
  }));

  return Platform.OS === "ios" ? (
    <PullToRefreshIOS scrollRef={scrollRef} {..._config} />
  ) : (
    <PullToRefreshAOS scrollRef={scrollRef} {..._config} />
  );
});

export default PullToRefreshFlatList;
