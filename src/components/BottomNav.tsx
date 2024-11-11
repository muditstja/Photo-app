import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

interface BottomNavProps {
  currentTab: string;
  navigation: NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;
}

export default function BottomNav({ currentTab, navigation }: BottomNavProps) {
  const tabs = [
    { name: 'Photos', route: 'Photos' },
    { name: 'Search', route: 'Search' },
    { name: 'Library', route: 'Library' },
    { name: 'Sharing', route: 'Sharing' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          onPress={() => navigation.navigate(tab.route)}
          style={styles.tab}
        >
          <Text
            style={[
              styles.tabText,
              currentTab === tab.name.toLowerCase() && styles.activeTabText,
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: '#757575',
    fontSize: 12,
  },
  activeTabText: {
    color: '#1a73e8',
  },
});