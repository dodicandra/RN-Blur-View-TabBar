import * as React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import {Galery} from '../screen/Galery';
import Home from '../screen/Home';
import {MyTabBar} from './TabBar';

const Stack = createStackNavigator();

const BottomStack = createBottomTabNavigator();

const BotomNav = () => (
  <BottomStack.Navigator
    tabBar={props => <MyTabBar {...props} />}
    screenOptions={{
      tabBarStyle: {
        position: 'absolute',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        overflow: 'hidden',
      },
      headerShown: false,
    }}>
    <BottomStack.Screen
      name="HOME"
      component={Home}
      options={{title: 'Home'}}
    />
    <BottomStack.Screen
      name="GALERY"
      component={Galery}
      options={{title: 'Galery'}}
    />
  </BottomStack.Navigator>
);

export const Main = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={BotomNav} />
    </Stack.Navigator>
  );
};
