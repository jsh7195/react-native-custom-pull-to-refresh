import React from 'react';
import { FlatListProps, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { SharedValue } from 'react-native-reanimated';
export interface IPullToRefreshComponentProps extends Omit<FlatListProps<any>, "data" | "renderItem" | "ListHeaderComponent"> {
    onRefresh?: () => void;
    onScroll?: ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined;
    THRESHOLD?: number;
    RefreshComponent?: React.Element | null | undefined;
    ListHeaderComponent?: React.Element | null | undefined;
    refreshPosition?: "top" | "bottom";
    data: any[];
    renderItem: any;
    contentContainerStyle?: any;
    useOpacity?: boolean;
}
export interface IPullToRefreshChild extends IPullToRefreshComponentProps {
    handleRefreshCompleteRefrshApi: () => void;
    handleRefreshComplete: () => void;
    THRESHOLD: number;
    scrollY: SharedValue<number>;
    enablePullToRefresh: SharedValue<boolean>;
    scrollRef: React.MutableRefObject<null>;
}
export interface IPullToRefreshFunction {
    goTop: () => void;
}
export default IPullToRefreshComponentProps;
