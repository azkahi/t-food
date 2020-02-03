import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  AsyncStorage
} from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { Block, Button, theme } from "galio-framework";

const { height, width } = Dimensions.get("screen");

import Colors from '../constants/Colors';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      phone: ''
    };
  }

  async componentDidMount() {
    const phone = await AsyncStorage.getItem('phone');
    const name = await AsyncStorage.getItem('name');

    this.setState({
      name, phone
    });
  }

  processButton = async () => {
    await AsyncStorage.removeItem('phone');
    await AsyncStorage.removeItem('name');
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.titleText, { fontSize: 20, marginTop: 20 }]}>Name: {this.state.name}</Text>
        <Text style={[styles.titleText, { fontSize: 20, marginTop: 20, marginBottom: 20 }]}>Phone number: {this.state.phone}</Text>
        <Button
          style={styles.button}
          onPress={() => this.processButton()}
          textStyle={styles.buttonText}
        >
          Log out
        </Button>
      </View>
    );
  }
}

SettingsScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    backgroundColor: Colors.PRIMARY_RED,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 5,
    shadowOpacity: 0,
    marginVertical: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  titleText: {
    fontSize: 60,
    color: 'black',
    textAlign: 'center'
  }
});
