import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { Block } from 'galio-framework';

import Colors from '../constants/Colors';

export default function Loading() {
  return (
    <Block flex style={styles.container}>
      <StatusBar hidden />
      <Block center>
        <ActivityIndicator size="large" color={Colors.secondaryColor} />
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
  }
});
