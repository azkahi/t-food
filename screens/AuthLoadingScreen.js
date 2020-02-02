import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
  AsyncStorage
} from 'react-native';

import Colors from '../constants/Colors';

import Loading from '../components/Loading';

export default class AuthLoadingScreen extends React.Component {
  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('phone');
      if (value !== null) {
        this.props.navigation.navigate('Home');
      } else {
        this.props.navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert(
        'ERROR',
        error.toString(),
        [
          { text: 'OK' },
        ],
        { cancelable: true }
      );
    }
  };

  componentDidMount() {
    this.retrieveData();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <ActivityIndicator size="large" color={Colors.secondaryColor} />
      </View>
    );
  }
}

AuthLoadingScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
