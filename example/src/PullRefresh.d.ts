import {FlatListProps} from 'react-native';

export interface IPullToRefreshComponentProps
  extends Omit<
    FlatListProps<any>,
    'data' | 'renderItem' | 'ListHeaderComponent'
  > {
  /**
   * Function to call when the list is pulled to refresh.
   * This function is triggered when the user pulls down the list.
   */
  onRefresh?: () => void;

  /**
   * Function to handle scroll event. It can be used to perform actions during the scroll.
   */
  onScroll?:
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | undefined;

  /**
   * The threshold height for triggering the refresh. Defaults to 150.
   * This is the height the user must pull down to trigger the onRefresh function.
   */
  THRESHOLD?: number;

  /**
   * Component displayed when the list is pulled down.
   * This could be an animation or an indicator that shows the list is being refreshed.
   */
  RefreshComponent?: React.Element | null | undefined;

  /**
   * Optional header component for the list. This component is displayed at the top of the list.
   */
  ListHeaderComponent?: React.Element | null | undefined;

  /**
   * Determines whether the refresh component appears above or below the ListHeaderComponent. Defaults to 'top'.
   */
  refreshPosition?: 'top' | 'bottom';

  /**
   * Data for the list. This is an array of any type that represents the data to be rendered in the list.
   */
  data: any[];

  /**
   * Function to render each item in the data array.
   * It defines how each item in the list should be rendered.
   */
  renderItem: any;

  /**
   * Style object for the content container. This allows for customization of the list's container style.
   */
  contentContainerStyle?: any;
}

export interface IPullToRefreshChild extends IPullToRefreshComponentProps {
  handleRefreshCompleteRefrshApi: () => void;
  handleRefreshComplete: () => void;
  THRESHOLD: number;
  scrollY: SharedValue<number>;
  enablePullToRefresh: SharedValue<boolean>;
  scrollRef: React.MutableRefObject<null>;
}

interface IPullToRefreshFunction {
  goTop: () => void;
}
