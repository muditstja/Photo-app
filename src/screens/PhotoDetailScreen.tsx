import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import * as MediaLibrary from 'expo-media-library';

type PhotoDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PhotoDetail'>;
  route: RouteProp<RootStackParamList, 'PhotoDetail'>;
};

export default function PhotoDetailScreen({ navigation, route }: PhotoDetailScreenProps) {
  const [photo, setPhoto] = React.useState<MediaLibrary.Asset | null>(null);

  React.useEffect(() => {
    (async () => {
      const asset = await MediaLibrary.getAssetInfoAsync(route.params.id);
      setPhoto(asset);
    })();
  }, [route.params.id]);

  if (!photo) return null;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photo.uri }}
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
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});