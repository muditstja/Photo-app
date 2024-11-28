import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhotosScreen from './src/screens/PhotosScreen';
import PhotoDetailScreen from './src/screens/PhotoDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import SharingScreen from './src/screens/SharingScreen';

export type RootStackParamList = {
  Photos: undefined;
  PhotoDetail: { id: string };
  Search: undefined;
  Library: undefined;
  Sharing: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Photos"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Photos" 
          component={PhotosScreen}
          options={{ title: 'Photos' }}
        />
        <Stack.Screen 
          name="PhotoDetail" 
          component={PhotoDetailScreen}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Library" component={LibraryScreen} />
        <Stack.Screen name="Sharing" component={SharingScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}