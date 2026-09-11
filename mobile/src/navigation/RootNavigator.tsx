import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { DecisionMemoScreen } from '../screens/DecisionMemoScreen';
import { IntakeScreen } from '../screens/IntakeScreen';
import { JobStatusScreen } from '../screens/JobStatusScreen';
import { MessageThreadScreen } from '../screens/MessageThreadScreen';
import { colors, fonts } from '../theme/tokens';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.ink,
        headerTitle: '',
        headerTitleStyle: { fontFamily: fonts.sansSemiBold },
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.bgApp },
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Intake" component={IntakeScreen} />
      <Stack.Screen name="DecisionMemo" component={DecisionMemoScreen} options={{ headerBackVisible: false }} />
      <Stack.Screen name="JobStatus" component={JobStatusScreen} options={{ headerBackVisible: false }} />
      <Stack.Screen name="MessageThread" component={MessageThreadScreen} />
    </Stack.Navigator>
  );
}
