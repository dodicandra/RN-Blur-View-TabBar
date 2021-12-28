import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {BlurView} from '@react-native-community/blur';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import {isIOS} from '../routes/TabBar';

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const Home = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const tabBarHeight = useBottomTabBarHeight();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : 'white',
  };

  return (
    <SafeAreaView style={[backgroundStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentInsetAdjustmentBehavior="scrollableAxes"
        contentContainerStyle={{paddingBottom: tabBarHeight}}
        style={[backgroundStyle]}>
        <View
          style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
          <Header />
          <View pointerEvents="box-none" style={styles.blur}>
            <BlurView
              blurType={isIOS ? 'ultraThinMaterialLight' : 'light'}
              blurAmount={7}
              style={StyleSheet.absoluteFill}
            />
          </View>
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  blur: {
    width: 100,
    height: 100,
    zIndex: 10,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    position: 'absolute',
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 5,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Home;
