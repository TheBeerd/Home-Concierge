import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { colors } from '../theme/tokens';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

function TabDot({ focused }: { focused: boolean }) {
  return <View style={[styles.dot, focused && styles.dotActive]} />;
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabDot focused={focused} /> }}
      />
      <Tab.Screen name="Requests" options={{ tabBarIcon: ({ focused }) => <TabDot focused={focused} /> }}>
        {() => <PlaceholderScreen title="Requests" />}
      </Tab.Screen>
      <Tab.Screen name="Messages" options={{ tabBarIcon: ({ focused }) => <TabDot focused={focused} /> }}>
        {() => <PlaceholderScreen title="Messages" />}
      </Tab.Screen>
      <Tab.Screen name="Account" options={{ tabBarIcon: ({ focused }) => <TabDot focused={focused} /> }}>
        {() => <PlaceholderScreen title="Account" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopColor: colors.line,
    height: 64,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: colors.line,
  },
  dotActive: {
    backgroundColor: colors.teal,
  },
});
