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
      stall: 'All',
      loadingRequest: false,
      initOrders: [],
      orders: []
    }
  }

  getOrders() {
    try {
      axios({
        method: 'get',
        url: 'https://sleepy-sierra-09311.herokuapp.com/orders',
        timeout: 10000,
      })
      .then(async (response) => {
        this.setState({ initOrders: response.data, loading: false, refreshing: false, loadingRequest: false });
        this.filterOrders(this.state.stall);
      })
      .catch((error) => {
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

  async changeStatusRequest(orderItem, orderStatus) {
    this.setState({ loadingRequest: true });

    const order = {
      status: orderStatus
    }

    try {
      await axios({
        method: 'put',
        url: `https://sleepy-sierra-09311.herokuapp.com/orders/${orderItem.id}`,
        data: {
          order
        }
      })
      .then(async (response) => {
        console.log(response.data);
      })
      .catch((error) => {
        this.setState({ loadingRequest: false });
        console.log(error);
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
      this.setState({ loadingRequest: false });
      console.log(error);
      Alert.alert(
        'ERROR',
        error.toString(),
        [
          { text: 'OK' },
        ],
        { cancelable: true }
      );
    }

    this.getOrders();
  }

  filterOrders(filter) {
    const { initOrders } = this.state;

    this.setState({ stall: filter });

    if (filter != 'All') {
      const resFilterOrders = initOrders.filter(item => filter == item.stall);
      this.setState({ orders: resFilterOrders });
    } else {
      this.setState({ orders: initOrders });
    }
  }

  displayDateTime(dateTime) {
    const dateObj = new Date(dateTime);

    return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
  }

  componentDidMount() {
    this.getOrders();
    this.interval = setInterval(() => {
      this.getOrders();
    }, 10000);
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getOrders();
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

    return (
      <View style={styles.orderBoxedContainer}>
        <View style={styles.orderContainer}>
          <View style={styles.stallContainer}>
            <Text style={[styles.detailText, {fontSize: 16, marginVertical: 0, textAlign: 'center'}]}>{item.stall}</Text>
            <Image style={{margin: 5, alignSelf: 'center', width: widthLogo, height: widthLogo}} source={this.renderLogoStall(item.stall)} />
          </View>
          <View style={styles.orderDetail}>
            <Text style={styles.detailText}>Date Ordered: { this.displayDateTime(item.created_at) }</Text>
            <Text style={styles.detailText}>Food: {item.food}</Text>
            <Text style={styles.detailText}>Name: {item.name}</Text>
            <Text style={styles.detailText}>Phone: {item.phone_number}</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
          <Text style={[styles.detailText, {alignSelf: 'center'}]}>Status:</Text>
          <View style={{marginLeft: 10, alignSelf:'center', borderWidth: 0.5, width: '80%', paddingVertical: 0, marginBottom: 10}}>
            <Picker
              selectedValue={item.status}
              style={[styles.pickerFilter]}
              onValueChange={((itemValue) => this.changeStatusRequest(item, itemValue))}
            >
              <Picker.Item key="Not Processed" label="Not Processed" value="Not Processed" />
              <Picker.Item key="Order Processed" label="Order Processed" value="Order Processed" />
              <Picker.Item key="Order Completed" label="Order Completed" value="Order Completed" />
            </Picker>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { loading, refreshing, orders, loadingRequest } = this.state;
    const widthLogo = 50;

    if (loading) {
      return (
        <Loading />
      );
    } else {
      return (
        <Block flex style={{marginTop: '10%'}}>
          <Text style={styles.filterText}>Choose stall:</Text>
          <View style={{alignSelf:'center', borderWidth: 0.5, width: '50%', paddingVertical: 0, marginVertical: 10}}>
            <Picker
              selectedValue={this.state.stall}
              style={styles.pickerFilter}
              onValueChange={((itemValue) => this.filterOrders(itemValue))}
            >
              <Picker.Item key="All" label="All" value="All" />
              { Food.map((stall) => <Picker.Item key={stall} label={stall} value={stall}/>) }
            </Picker>
          </View>

          { loadingRequest ? <Loading /> : null }

          <FlatList
            data={orders}
            renderItem={({ item }) => this.renderItem(item)}
            keyExtractor={item => `${item.id}`}
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
    flexDirection: 'row',
  },
  orderBoxedContainer: {
    flex: 1,
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
    justifyContent: 'center'
  },
  detailText: {
    fontSize: 12,
    color: 'black',
    textAlign: 'left',
    marginVertical: 5
  },
  filterText: {
    textAlign: 'center',
    fontSize: 18
  },
  pickerFilter: {
    alignSelf: 'center',
    width: '100%',
    height: 50,
    paddingHorizontal: 5,
    borderWidth: 5
  }
});
