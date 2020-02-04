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
  FlatList,
  ActivityIndicator,
  RefreshControl
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
      refreshing: false,
      orders: [
          {
            "id": 1,
            "name": "Azka",
            "phone_number": "08111",
            "food": "Teh Manis",
            "stall": "Wilasa",
            "created_at": "2020-02-03T03:49:59.041Z",
            "updated_at": "2020-02-03T03:49:59.041Z"
          },
          {
            "id": 2,
            "name": "Azka",
            "phone_number": "08111",
            "food": "Strawberry",
            "stall": "Rotupang",
            "created_at": "2020-02-03T03:49:59.041Z",
            "updated_at": "2020-02-03T03:49:59.041Z"
          },
          {
            "id": 3,
            "name": "Azka",
            "phone_number": "08111",
            "food": "Hot Lemon Tea",
            "stall": "Andalan Coffee",
            "created_at": "2020-02-03T03:49:59.041Z",
            "updated_at": "2020-02-03T03:49:59.041Z"
          }
      ]
    }
  }

  getOrders() {
    console.log('Getting Data');

    try {
      axios({
        method: 'get',
        url: 'https://sleepy-sierra-09311.herokuapp.com/orders',
        timeout: 10000,
      })
      .then(async (response) => {
        console.log(response.data);
        this.setState({ orders: response.data, loading: false, refreshing: false });
      })
      .catch((error) => {
        console.log('Error 1');
        this.setState({ loading: false, refreshing: false });
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
      console.log('Error 2');
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
    this.getOrders();
    this.interval = setInterval(() => {
      this.setState({ refreshing: true });
      this.getOrders();
    }, 30000);
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

  renderItem(item) {
    const widthLogo = 100;
    console.log({item});
    return (
      <View style={styles.orderContainer}>
        <View style={styles.stallContainer}>
          <Text style={[styles.detailText, {fontSize: 16, marginVertical: 0, textAlign: 'center'}]}>{item.stall}</Text>
          <Image style={{margin: 5, alignSelf: 'center', width: widthLogo, height: widthLogo}} source={this.renderLogoStall(item.stall)} />
        </View>
        <View style={styles.orderDetail}>
          <Text style={styles.detailText}>Food: {item.food}</Text>
          <Text style={styles.detailText}>Name: {item.name}</Text>
          <Text style={styles.detailText}>Phone: {item.phone_number}</Text>
        </View>
      </View>
    );
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getOrders();
  }

  render() {
    const { navigation } = this.props;
    const { loading, refreshing, orders } = this.state;
    const widthLogo = 50;

    if (loading) {
      return (
        <Loading />
      );
    } else {
      return (
        <Block flex style={{marginTop: 30}}>
          <FlatList
            data={orders}
            renderItem={({ item }) => this.renderItem(item)}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
            }
          />
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
  orderContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    borderWidth: 0.5,
    borderRadius: 20
  },
  orderDetail: {
    flex: 1,
    marginHorizontal: 30,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  stallContainer: {
    marginLeft: 15,
    marginVertical: 10,
    flexDirection: 'column',
  },
  detailText: {
    fontSize: 12,
    color: 'black',
    textAlign: 'left',
    marginVertical: 5
  }
});
