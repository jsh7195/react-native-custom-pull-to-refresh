## Props

### `onRefresh?: () => void`

- Function to call when the list is pulled to refresh. This function is triggered when the user pulls down the list.

### `onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void`

- Function to handle scroll event. It can be used to perform actions during the scroll.

### `THRESHOLD?: number`

- The threshold height for triggering the refresh. Defaults to 150. This is the height the user must pull down to trigger the onRefresh function.

### `RefreshComponent?: React.Element | null | undefined`

- Component displayed when the list is pulled down. This could be an animation or an indicator that shows the list is being refreshed.

### `ListHeaderComponent?: React.Element | null | undefined`

- Optional header component for the list. This component is displayed at the top of the list.

### `refreshPosition?: 'top' | 'bottom'`

- Determines whether the refresh component appears above or below the ListHeaderComponent. Defaults to 'top'.

### `data: any[]`

- Data for the list. This is an array of any type that represents the data to be rendered in the list.

### `renderItem: any`

- Function to render each item in the data array. It defines how each item in the list should be rendered.

### `contentContainerStyle?: any`

- Style object for the content container. This allows for customization of the list's container style.
