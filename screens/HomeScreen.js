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
  Picker,
  FlatList
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
    { name: 'Hot Lemon Tea', price: 'Rp 10.000'},
    { name: 'Hot Ginger Tea', price: 'Rp 10.000'},
    { name: 'Ice Thai Tea', price: 'Rp 15.000'},
    { name: 'Hot Espresso', price: 'Rp 10.000'},
    { name: 'Ice Coffe Milk', price: 'Rp 17.000'},
  ],
  'Rotupang': [
    { name: 'Coklat', price: 'Rp 15.000'},
    { name: 'Strawberry', price: 'Rp 15.000'},
    { name: 'Kacang', price: 'Rp 15.000'},
    { name: 'Telor Sosis', price: 'Rp 20.000'},
    { name: 'Telor Kornet', price: 'Rp 20.000'},
  ],
  'Wilasa': [
    { name: 'Hot Lemon Tea', price: 'Rp 12.000'},
    { name: 'Teh Susu Jahe Hangat', price: 'Rp 15.000'},
    { name: 'Es Teh Leci', price: 'Rp 20.000'},
    { name: 'Kopi Hitam', price: 'Rp 10.000'},
    { name: 'Kopi Susu', price: 'Rp 12.500'},
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
    this.setState({ loading: true });

    console.log('Posting Data');

    const name = await AsyncStorage.getItem('name');
    const phone_number = await AsyncStorage.getItem('phone');

    const order = {
      name: name,
      phone_number: phone_number,
      food: food,
      stall: stall,
      status: "Not Processed"
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

        Alert.alert(
          `Your order of ${food} from ${stall} will be ordered soon.`,
          '',
          [
            { text: 'OK' },
          ],
          { cancelable: true }
        );
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

  processInput(stall, food) {
    Alert.alert(
      'Are you sure you want to buy this item?',
      `Ordering ${food} from ${stall}`,
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => this.createOrderRequest(stall, food),
        },
      ],
      { cancelable: true }
    );
  }

  renderLogoStall(stall) {
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

  renderStalls(item) {
    const foods = stallFood[item];
    const widthLogo = 200;

    console.log({ foods });

    return(
      <View style={styles.boxedContainer}>
        <Text style={[styles.titleText]}>{item}</Text>
        <Image style={{marginVertical: 20, alignSelf: 'center', width: widthLogo, height: widthLogo}} source={this.renderLogoStall(item)} />

        <Text style={[styles.titleText, {fontSize: 20}]}>Menu:</Text>
        <View style={styles.orderContainer}>
          {
            foods.map((food) => (
              <Button
                key={`${item}-${food.name}`}
                style={styles.button}
                onPress={() => this.processInput(item, food.name)}
                textStyle={styles.buttonText}
              >
                <Text style={styles.orderText}>{food.name} - {food.price}</Text>
              </Button>
            ))
          }
        </View>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { loading } = this.state;

    console.log( stallFood[this.state.stall] );

    if (loading) {
      return (
        <Loading />
      );
    } else {
      return (
        <Block flex>
          <Text style={[styles.title, styles.titleText]}>Cheers you app!</Text>
          <FlatList
            data={Food}
            renderItem={({ item }) => this.renderStalls(item)}
            keyExtractor={item => item}
          />
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
    alignSelf: 'center',
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
  boxedContainer: {
    flex: 1,
    borderWidth: 0.5,
    borderRadius: 10,
    margin: 10,
    paddingVertical: 10
  },
  orderContainer: {
    flex: 1,
    alignItems: 'center'
  },
  orderText: {
    color: 'white'
  }
});
