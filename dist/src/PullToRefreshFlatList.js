"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.PullToRefreshFlatList = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var PullToRefreshIOS_1 = require("./PullToRefreshIOS");
var PullToRefreshAOS_1 = require("./PullToRefreshAOS");
var PullToRefreshFlatList = (0, react_1.forwardRef)(function (props, ref) {
    var ListHeaderComponent = props.ListHeaderComponent, RefreshComponent = props.RefreshComponent, _a = props.THRESHOLD, THRESHOLD = _a === void 0 ? 130 : _a, _b = props.refreshPosition, refreshPosition = _b === void 0 ? "top" : _b, onRefresh = props.onRefresh, _c = props.useOpacity, useOpacity = _c === void 0 ? true : _c;
    var scrollY = (0, react_native_reanimated_1.useSharedValue)(0);
    var enablePullToRefresh = (0, react_native_reanimated_1.useSharedValue)(true);
    var scrollRef = react_1.default.useRef(null);
    var timeoutFunction = function () {
        scrollY.value = (0, react_native_reanimated_1.withTiming)(0, {
            duration: 200,
            easing: react_native_reanimated_1.Easing.linear,
        }, function (isFinish) {
            if (isFinish) {
                if (!enablePullToRefresh.value) {
                    enablePullToRefresh.value = true;
                }
            }
        });
    };
    var refreshApi = function () {
        if (onRefresh) {
            onRefresh();
        }
    };
    var handleRefreshCompleteRefrshApi = function () {
        "worklet";
        (0, react_native_reanimated_1.runOnJS)(refreshApi)();
        (0, react_native_reanimated_1.runOnJS)(setTimeout)(timeoutFunction, 1500);
    };
    var handleRefreshComplete = function () {
        "worklet";
        scrollY.value = (0, react_native_reanimated_1.withTiming)(0, {
            duration: 200,
            easing: react_native_reanimated_1.Easing.linear,
        }, function (isFinish) {
            if (isFinish) {
                if (!enablePullToRefresh.value) {
                    enablePullToRefresh.value = true;
                }
            }
        });
    };
    var loadingWrapAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
        return {
            height: enablePullToRefresh.value ? (0, react_native_reanimated_1.interpolate)(scrollY.value, [0, THRESHOLD], [0, THRESHOLD], "clamp") : 0,
        };
    });
    var wrapAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
        return {
            opacity: useOpacity ? (enablePullToRefresh.value ? (0, react_native_reanimated_1.interpolate)(scrollY.value, [0, THRESHOLD], [0, 1], "clamp") : 0) : 1,
            height: enablePullToRefresh.value ? (0, react_native_reanimated_1.interpolate)(scrollY.value, [0, THRESHOLD], [0, THRESHOLD], "clamp") : 0,
        };
    });
    var _ListHeaderComponent = (0, react_1.useCallback)(function () {
        return (react_1.default.createElement(react_native_reanimated_1.default.View, null,
            refreshPosition === "bottom" && ListHeaderComponent ? react_1.default.createElement(ListHeaderComponent, null) : null,
            react_1.default.createElement(react_native_reanimated_1.default.View, { style: [
                    loadingWrapAnimatedStyle,
                    {
                        overflow: "hidden",
                    },
                ] },
                react_1.default.createElement(react_native_reanimated_1.default.View, { style: wrapAnimatedStyle }, RefreshComponent ? (react_1.default.createElement(RefreshComponent, null)) : (react_1.default.createElement(react_native_reanimated_1.default.Text, { style: {
                        flex: 1,
                        textAlign: "center",
                        color: "yellow",
                        backgroundColor: "green",
                        paddingBottom: 15,
                        fontSize: 12,
                        fontWeight: "800",
                        letterSpacing: -0.4,
                    } }, "Pull to the end to refresh")))),
            refreshPosition === "top" && ListHeaderComponent ? react_1.default.createElement(ListHeaderComponent, null) : null));
    }, [RefreshComponent, refreshPosition, ListHeaderComponent, loadingWrapAnimatedStyle, wrapAnimatedStyle]);
    var _config = __assign(__assign({}, props), { scrollY: scrollY, THRESHOLD: THRESHOLD, handleRefreshCompleteRefrshApi: handleRefreshCompleteRefrshApi, handleRefreshComplete: handleRefreshComplete, enablePullToRefresh: enablePullToRefresh, ListHeaderComponent: _ListHeaderComponent });
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        goTop: function () {
            setTimeout(function () { var _a; return (_a = scrollRef.current) === null || _a === void 0 ? void 0 : _a.scrollToOffset({ animated: true, offset: 0 }); }, 100);
        },
    }); });
    return (react_1.default.createElement(react_native_gesture_handler_1.GestureHandlerRootView, { style: { flex: 1 } }, react_native_1.Platform.OS === "ios" ? react_1.default.createElement(PullToRefreshIOS_1.PullToRefreshIOS, __assign({ scrollRef: scrollRef }, _config)) : react_1.default.createElement(PullToRefreshAOS_1.PullToRefreshAOS, __assign({ scrollRef: scrollRef }, _config))));
});
exports.PullToRefreshFlatList = PullToRefreshFlatList;
//# sourceMappingURL=PullToRefreshFlatList.js.map