"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullToRefreshIOS = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var PullToRefreshIOS = function (props) {
    var scrollRef = props.scrollRef, ListHeaderComponent = props.ListHeaderComponent, onScroll = props.onScroll, handleRefreshCompleteRefrshApi = props.handleRefreshCompleteRefrshApi, handleRefreshComplete = props.handleRefreshComplete, scrollY = props.scrollY, THRESHOLD = props.THRESHOLD, enablePullToRefresh = props.enablePullToRefresh, contentContainerStyle = props.contentContainerStyle, data = props.data, renderItem = props.renderItem, keyExtractor = props.keyExtractor;
    var panRef = (0, react_1.useRef)();
    var nativeRef = (0, react_1.useRef)();
    var isScrolling = (0, react_native_reanimated_1.useSharedValue)(false);
    var panGesture = react_native_gesture_handler_1.Gesture.Pan()
        .manualActivation(false)
        .minPointers(1)
        .onTouchesDown(function (event, stateManager) { })
        .onUpdate(function (event) {
        if (enablePullToRefresh.value) {
            scrollY.value = event.translationY;
        }
    })
        .onEnd(function (event) {
        if (enablePullToRefresh.value) {
            if (scrollY.value > THRESHOLD + 5) {
                handleRefreshCompleteRefrshApi();
            }
            else {
                handleRefreshComplete();
            }
        }
    })
        .activeOffsetY([THRESHOLD * -1, 5])
        .failOffsetX([-50000, 50000])
        .failOffsetY([0, 50000])
        .simultaneousWithExternalGesture(nativeRef)
        .withRef(panRef);
    var nativeGesture = react_native_gesture_handler_1.Gesture.Native()
        .simultaneousWithExternalGesture(panRef)
        .withRef(nativeRef);
    var scrollHandler = (0, react_native_reanimated_1.useAnimatedScrollHandler)({
        onScroll: function (event, ctx) {
            if (event.contentOffset.y <= 0) {
                scrollY.value = 0;
            }
            else {
                enablePullToRefresh.value = false;
                scrollY.value = event.contentOffset.y;
            }
            if (onScroll) {
                (0, react_native_reanimated_1.runOnJS)(onScroll)(event);
            }
        },
        onBeginDrag: function () {
            isScrolling.value = true;
        },
        onEndDrag: function () {
            isScrolling.value = false;
        },
    });
    (0, react_native_reanimated_1.useAnimatedReaction)(function () { return ({
        value1: scrollY.value,
        value2: isScrolling.value,
    }); }, function (values) {
        if (values.value1 === 0 && !values.value2) {
            enablePullToRefresh.value = true;
        }
    });
    return (react_1.default.createElement(react_native_gesture_handler_1.GestureDetector, { gesture: panGesture },
        react_1.default.createElement(react_native_1.View, { style: { flex: 1 } },
            react_1.default.createElement(react_native_gesture_handler_1.GestureDetector, { gesture: nativeGesture },
                react_1.default.createElement(react_native_reanimated_1.default.FlatList, { ref: scrollRef, onRefresh: undefined, refreshing: false, scrollEventThrottle: 16, onScroll: scrollHandler, overScrollMode: 'never', bounces: false, showsVerticalScrollIndicator: false, contentContainerStyle: contentContainerStyle, data: data, renderItem: renderItem, keyExtractor: keyExtractor, ListHeaderComponent: react_1.default.createElement(ListHeaderComponent, null) })))));
};
exports.PullToRefreshIOS = PullToRefreshIOS;
//# sourceMappingURL=PullToRefreshIOS.js.map