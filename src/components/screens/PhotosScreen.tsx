import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { GridLayout } from "@nativescript/core";
import { PhotoGrid } from "../PhotoGrid";
import { BottomNav } from "../BottomNav";

type PhotosScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "Photos">,
};

export function PhotosScreen({ navigation }: PhotosScreenProps) {
    return (
        <gridLayout rows="*, auto">
            <PhotoGrid row={0} onPhotoPress={(id: any) => navigation.navigate("PhotoDetail", { id })} />
            <BottomNav row={1} currentTab="photos" navigation={navigation} />
        </gridLayout>
    );
}