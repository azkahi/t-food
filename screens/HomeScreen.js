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
import axios from 'axios';

const { height, width } = Dimensions.get("screen");

import Loading from '../components/Loading';

import Colors from '../constants/Colors';

import Food from '../constants/Food';

const logoAndalan = require('../assets/images/andalan.jpg');
const logoRotupang = require('../assets/images/rotupang.jpg');
const logoWilasa = require('../assets/images/wilasa.png');

const stallFood = {
  'Andalan Coffee': [
    'Hot Lemon Tea',
    'Hot Ginger Tea',
    'Ice Thai Tea',
    'Hot Espresso',
    'Ice Coffe Milk',
  ],
  'Rotupang': [
    'Coklat',
    'Strawberry',
    'Kacang',
    'Telor Sosis',
    'Telor Kornet',
  ],
  'Wilasa': [
    'Hot Lemon Tea',
    'The Susu Jahe Hangat',
    'Es Teh Leci',
    'Kopi Hitam',
    'Kopi Susu',
  ]
};

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      food: '',
      stall: 'Andalan Coffee',
      loading: false
    }
  }

  async createOrderRequest(stall, food) {
    console.log('Posting Data');

    const name = await AsyncStorage.getItem('name');
    const phone_number = await AsyncStorage.getItem('phone');

    const order = {
      name: name,
      phone_number: phone_number,
      food: food,
      stall: stall
    }

    console.log({ order });

    try {
      await axios({
        method: 'post',
        url: 'https://sleepy-sierra-09311.herokuapp.com/orders',
        data: {
          order
        }
      })
      .then(async (response) => {
        console.log(response.data);
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        Alert.alert(
          'ERROR',
          error.toString(),
          [
            { text: 'OK' },
          ],
          { cancelable: true }
        );
      })
    } catch (error) {
      this.setState({ loading: false, refreshing: false });
      Alert.alert(
        'ERROR',
        error.toString(),
        [
          { text: 'OK' },
        ],
        { cancelable: true }
      );
    }
  }

  saveFood(stall, food) {
    this.setState({ loading: true });

    this.createOrderRequest(stall, food);

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

  renderLogoStall() {
    const { stall } = this.state;

    switch (stall) {
      case 'Andalan Coffee':
        return(logoAndalan);
        break;
      case 'Rotupang':
        return(logoRotupang);
        break;
      case 'Wilasa':
        return(logoWilasa);
        break;
      default:
        return(logoAndalan);
        break;
    }
  }

  render() {
    const { navigation } = this.props;
    const { loading } = this.state;
    const widthLogo = 200;

    console.log( stallFood[this.state.stall] );

    if (loading) {
      return (
        <Loading />
      );
    } else {
      return (
        <Block flex>
          <Text style={[styles.title, styles.titleText]}>Cheers you app!</Text>
          <Image style={{marginVertical: 20, alignSelf: 'center', width: widthLogo, height: widthLogo}} source={this.renderLogoStall()} />
          <KeyboardAvoidingView behavior='padding' enabled style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginHorizontal: 20, marginVertical: 5 }}>
            <Text style={[styles.titleText, {fontSize: 20, marginTop: 40}]}>Stall:</Text>
            <View style={{marginVertical: 10, width: width - 40, backgroundColor: 'white', alignItems: 'center' }}>
            <Picker
              selectedValue={this.state.stall}
              style={{height: 50, width: '100%'}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({stall: itemValue, food: ''})
              }>
              { Food.map((stall) => <Picker.Item label={stall} value={stall} />) }
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
              <Picker.Item label='' value='' />
              { this.state.stall ? stallFood[this.state.stall].map((food) => <Picker.Item label={food} value={food} /> ) : null }
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
}

HomeScreen.navigationOptions = {
  header: null,
};

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
    marginTop: 10,
    marginBottom: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  title: {
    marginTop:'10%',
    marginBottom: 10
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
    fontSize: 35,
    color: Colors.PRIMARY_RED,
    textAlign: 'center'
  },
  subtitleText: {
    fontSize: 24,
    color: 'white',
  },
});
