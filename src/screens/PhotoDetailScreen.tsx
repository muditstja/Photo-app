import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type PhotoDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PhotoDetail'>;
  route: RouteProp<RootStackParamList, 'PhotoDetail'>;
};

export default function PhotoDetailScreen({ route }: PhotoDetailScreenProps) {
  const { uri } = route.params;

  console.log('Photo URI:', uri);

  if (!uri) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Error: URI not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
