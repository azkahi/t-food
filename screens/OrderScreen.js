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

export default class OrderScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      orders: []
    }
  }

  async getOrders() {
    console.log('Getting Data');

    try {
      await axios({
        method: 'get',
        url: 'https://sleepy-sierra-09311.herokuapp.com/orders',
      })
      .then(async (response) => {
        console.log(response.data);
        this.setState({ orders: response.data, loading: false });
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

  componentDidMount() {
    getOrders();
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
    const { navigation, loading } = this.props;
    const widthLogo = 50;

    if (loading) {
      return (<Loading />);
    } else {
      return (
        <Block flex>
          <Text style={[styles.title, styles.titleText]}>Order A Food</Text>
          <Image style={{marginVertical: 20, alignSelf: 'center', width: widthLogo, height: widthLogo}} source={this.renderLogoStall()} />
            <Text style={[styles.titleText, {fontSize: 20, marginTop: 20}]}>Stall:</Text>
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

OrderScreen.navigationOptions = {
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
    fontSize: 35,
    color: Colors.PRIMARY_RED,
    textAlign: 'center'
  },
  subtitleText: {
    fontSize: 24,
    color: 'white',
  },
});
