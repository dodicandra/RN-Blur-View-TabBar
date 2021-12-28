import React from 'react';

import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

const Lego = require('../assets/lego.jpg');

const {height, width} = Dimensions.get('window');

interface GaleryProps {}

const items = Array.from(Array(40)).map((_, index) => ({id: index}));

const Galery: React.FC<GaleryProps> = () => {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={Lego}
        style={{flex: 1, height, width}}
        resizeMethod="scale"
        resizeMode="cover">
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: tabBarHeight}}>
          {items.map(item => (
            <View
              key={item.id}
              style={{height: 120, borderWidth: 2, marginVertical: 10}}>
              <Text style={{fontSize: 30}}>components</Text>
            </View>
          ))}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});

export {Galery};
