import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  View,
  TextInput,
  AsyncStorage,
  Alert,
  Picker
} from "react-native";
import * as Font from 'expo-font';
import { Block, Button, theme } from "galio-framework";

const { height, width } = Dimensions.get("screen");

import Loading from '../components/Loading';

import Colors from '../constants/Colors';

import Food from '../constants/Food';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      food: '',
      stall: '',
    }
  }

  saveFood(stall, food) {
    Alert.alert(
      `Your order of ${food} from ${stall} will be ordered soon.`,
      '',
      [
        { text: 'OK' },
      ],
      { cancelable: true }
    );
  }

  processInput() {
    const { stall, food } = this.state;

    if (!food) {
      Alert.alert(
        'You must specify a food.',
        '',
        [
          { text: 'OK' },
        ],
        { cancelable: true }
      );
    } else {
      this.setState({ loading: true });
      this.saveFood(stall, food);
    }
  }

  render() {
    const { navigation } = this.props;

      return (
        <Block flex>
          <Text style={[styles.title, styles.titleText]}>Order A Food</Text>
          <KeyboardAvoidingView behavior='padding' enabled style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginHorizontal: 20, marginVertical: 5 }}>
            <Text style={[styles.titleText, {fontSize: 20, marginTop: 20}]}>Stall:</Text>
            <View style={{marginVertical: 10, width: width - 40, backgroundColor: 'white', alignItems: 'center' }}>
            <Picker
              selectedValue={this.state.stall}
              style={{height: 50, width: '100%'}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({stall: itemValue})
              }>
              <Picker.Item label='' value='' />
              { Food.map((stall) => <Picker.Item label={stall.name} value={stall.name} />) }
            </Picker>
            </View>

            <Text style={[styles.titleText, {fontSize: 20, marginTop: 20}]}>Food:</Text>
            <View style={{marginVertical: 10, width: width - 40, backgroundColor: 'white', alignItems: 'center'  }}>
            <Picker
              selectedValue={this.state.food}
              style={{height: 50, width: '100%'}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({food: itemValue})
              }>
              { Food[0].food.map((food) => <Picker.Item label={food} value={food} /> ) }
            </Picker>
            </View>

            <Button
              style={styles.button}
              onPress={() => this.processInput()}
              textStyle={styles.buttonText}
            >
              Order
            </Button>
          </KeyboardAvoidingView>
        </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
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
  title: {
    marginTop:'15%'
  },
  subtitle: {
    marginTop: 20
  },
  signInButton: {
    width: '100%',
    height: 60,
    resizeMode: 'contain',
  },
  titleText: {
    fontSize: 60,
    color: Colors.PRIMARY_RED,
    textAlign: 'center'
  },
  subtitleText: {
    fontSize: 24,
    color: 'white',
  },
});
