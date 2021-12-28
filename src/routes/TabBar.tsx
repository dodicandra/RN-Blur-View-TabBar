import React from 'react';

import {
  Animated,
  LayoutChangeEvent,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import {BlurView} from '@react-native-community/blur';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {BottomTabDescriptorMap} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import BottomTabBarHeightCallbackContext from '@react-navigation/bottom-tabs/src/utils/BottomTabBarHeightCallbackContext';
import {
  NavigationContext,
  NavigationRouteContext,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import {EdgeInsets, useSafeAreaFrame} from 'react-native-safe-area-context';
import Ant from 'react-native-vector-icons/AntDesign';

const DEFAULT_TABBAR_HEIGHT = 55;
const COMPACT_TABBAR_HEIGHT = 32;
const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;

export const isIOS = Platform.OS === 'ios';

type Options = {
  state: TabNavigationState<ParamListBase>;
  descriptors: BottomTabDescriptorMap;
  layout: {height: number; width: number};
  dimensions: {height: number; width: number};
};

type Props = BottomTabBarProps & {
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};

const shouldUseHorizontalLabels = ({
  state,
  descriptors,
  layout,
  dimensions,
}: Options) => {
  const {tabBarLabelPosition} =
    descriptors[state.routes[state.index].key].options;

  if (tabBarLabelPosition) {
    switch (tabBarLabelPosition) {
      case 'beside-icon':
        return true;
      case 'below-icon':
        return false;
    }
  }

  if (layout.width >= 768) {
    // Screen size matches a tablet
    const maxTabWidth = state.routes.reduce((acc, route) => {
      const {tabBarItemStyle} = descriptors[route.key].options;
      const flattenedStyle = StyleSheet.flatten(tabBarItemStyle);

      if (flattenedStyle) {
        if (typeof flattenedStyle.width === 'number') {
          return acc + flattenedStyle.width;
        } else if (typeof flattenedStyle.maxWidth === 'number') {
          return acc + flattenedStyle.maxWidth;
        }
      }

      return acc + DEFAULT_MAX_TAB_ITEM_WIDTH;
    }, 0);

    return maxTabWidth <= layout.width;
  } else {
    return dimensions.width > dimensions.height;
  }
};

const getPaddingBottom = (insets: EdgeInsets) =>
  Math.max(insets.bottom - Platform.select({ios: 4, default: 0}), 0);

const getTabBarHeight = ({
  state,
  descriptors,
  dimensions,
  insets,
  style,
  ...rest
}: Options & {
  insets: EdgeInsets;
  style: Animated.WithAnimatedValue<StyleProp<ViewStyle>> | undefined;
}) => {
  // @ts-ignore
  const customHeight = StyleSheet.flatten(style)?.height;

  if (typeof customHeight === 'number') {
    return customHeight;
  }

  const isLandscape = dimensions.width > dimensions.height;
  const horizontalLabels = shouldUseHorizontalLabels({
    state,
    descriptors,
    dimensions,
    ...rest,
  });
  const paddingBottom = getPaddingBottom(insets);

  if (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    isLandscape &&
    horizontalLabels
  ) {
    return COMPACT_TABBAR_HEIGHT + paddingBottom;
  }

  return DEFAULT_TABBAR_HEIGHT + paddingBottom;
};

export function MyTabBar({
  state,
  descriptors,
  navigation,
  style,
  insets,
}: Props) {
  const dimensions = useSafeAreaFrame();

  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;
  const {tabBarStyle} = focusedOptions;

  const [layout, setLayout] = React.useState({
    height: 0,
    width: dimensions.width,
  });

  const paddingBottom = getPaddingBottom(insets);

  const tabBarHeight = getTabBarHeight({
    state,
    descriptors,
    insets,
    dimensions,
    layout,
    style: [tabBarStyle, style],
  });

  const onHeightChange = React.useContext(BottomTabBarHeightCallbackContext);

  const handleLayout = (e: LayoutChangeEvent) => {
    const {height, width} = e.nativeEvent.layout;

    onHeightChange?.(height);

    setLayout(layouts => {
      if (height === layouts.height && width === layouts.width) {
        return layouts;
      } else {
        return {
          height,
          width,
        };
      }
    });
  };

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.tabBar,
        {
          height: tabBarHeight,
          paddingBottom,
          paddingHorizontal: Math.max(insets.left, insets.right),
          paddingTop: 6,
        },
        tabBarStyle as any,
      ]}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill]}>
        <BlurView
          blurType={isIOS ? 'ultraThinMaterialLight' : 'light'}
          blurAmount={10}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View accessibilityRole="tablist" style={styles.content}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              // @ts-ignore
              navigation.navigate({name: route.name, merge: true});
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <NavigationContext.Provider
              key={route.key}
              value={descriptors[route.key].navigation}>
              <NavigationRouteContext.Provider value={route}>
                <TouchableOpacity
                  accessibilityRole="button"
                  key={route.key}
                  accessibilityState={isFocused ? {selected: true} : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={{flex: 1}}>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Ant
                      name={label === 'Home' ? 'home' : 'laptop'}
                      color={isFocused ? '#1201f5' : '#222'}
                      size={25}
                    />
                    <Text style={{color: isFocused ? '#1201f5' : '#222'}}>
                      {label}
                    </Text>
                  </View>
                </TouchableOpacity>
              </NavigationRouteContext.Provider>
            </NavigationContext.Provider>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
});
