import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { PhotosScreen } from "./screens/PhotosScreen";
import { PhotoDetailScreen } from "../screens/PhotoDetailScreen";
// import { SearchScreen } from "./screens/SearchScreen";
// import { LibraryScreen } from "./screens/LibraryScreen";
// import { SharingScreen } from "./screens/SharingScreen";

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => (
    <BaseNavigationContainer>
        <StackNavigator.Navigator
            initialRouteName="Photos"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#000000",
                },
                headerTintColor: "#ffffff",
                headerShown: true,
            }}
        >
            <StackNavigator.Screen
                name="Photos"
                component={PhotosScreen}
                options={{
                    title: "Photos"
                }}
            />
            <StackNavigator.Screen
                name="PhotoDetail"
                component={PhotoDetailScreen}
                options={{
                    title: ""
                }}
            />
            <StackNavigator.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    title: "Search"
                }}
            />
            <StackNavigator.Screen
                name="Library"
                component={LibraryScreen}
                options={{
                    title: "Library"
                }}
            />
            <StackNavigator.Screen
                name="Sharing"
                component={SharingScreen}
                options={{
                    title: "Sharing"
                }}
            />
        </StackNavigator.Navigator>
    </BaseNavigationContainer>
);