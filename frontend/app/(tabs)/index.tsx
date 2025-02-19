import 'expo-dev-client';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { Icon } from 'react-native-paper';
import HomeScreen from './HomeScreen';
import LandingScreen from './LandingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screens
const SearchScreen = () => <Text>Search</Text>;
const HistoryScreen = () => <Text>History</Text>;
const AccountScreen = () => <Text>Account</Text>;

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Search':
              iconName = 'magnify';
              break;
            case 'History':
              iconName = 'history';
              break;
            case 'Account':
              iconName = 'account';
              break;
          }

          return <Icon source={iconName} size={size} color={color} />;
        },
        headerShown: false, // Hide headers in the tab navigator
      })}
    >
      <Tab.Screen name="Home" component={LandingScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Landing" component={TabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
