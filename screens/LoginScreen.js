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
  Alert
} from "react-native";
import * as Font from 'expo-font';
import { Block, Button, theme } from "galio-framework";

const { height, width } = Dimensions.get("screen");

import Loading from '../components/Loading';

import Colors from '../constants/Colors';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      name: ''
    }
  }

  async savePhoneName(phone, name) {
    await AsyncStorage.setItem('phone', phone);
    await AsyncStorage.setItem('name', name);
    this.setState({ loading: false });
    this.props.navigation.navigate('Home');
  }

  processInput() {
    const { phone, name } = this.state;

    if ((!phone) || (!name)) {
      console.log(phone);
      Alert.alert(
        'You must provide a phone number and a name.',
        '',
        [
          { text: 'OK' },
        ],
        { cancelable: true }
      );
    } else {
      this.setState({ loading: true });
      this.savePhoneName(phone, name);
    }
  }

  render() {
    const { navigation } = this.props;
    const widthLogo = 250;

      return (
        <Block flex>
          <KeyboardAvoidingView behavior='padding' enabled style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginHorizontal: 20, marginVertical: 5 }}>
            <Image style={[styles.title, {width: widthLogo, height: widthLogo * 461 / 377}]} source={require("../assets/images/logo.png")} />
            <View style={styles.phoneNumberContainer}>
              <Text style={[styles.titleText, {fontSize: 20, marginTop: 20}]}>Name:</Text>
              <View style={{marginVertical: 10, width: width - 40, backgroundColor: 'white' }}>
                <TextInput
                  style={{ height: 50, borderBottomWidth: 1, paddingHorizontal: 10 }}
                  onChangeText={text => this.setState({ name: text })}
                  value={this.state.name}
                  textAlign={'center'}
                  autoCompleteType='off'
                />
              </View>
              <Text style={[styles.titleText, {fontSize: 20, marginTop: 20}]}>Phone number:</Text>
              <View style={{marginVertical: 10, width: width - 40, backgroundColor: 'white' }}>
                <TextInput
                  style={{ height: 50, borderBottomWidth: 1, paddingHorizontal: 10, marginBottom: 20 }}
                  onChangeText={text => this.setState({ phone: text })}
                  value={this.state.phone}
                  keyboardType='phone-pad'
                  textAlign={'center'}
                  autoCompleteType='off'
                />
              </View>
            </View>

            <Button
              style={styles.button}
              onPress={() => this.processInput()}
              textStyle={styles.buttonText}
            >
              Login
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
  phoneNumberContainer: {
    marginTop: 20
  },
  title: {
    marginTop:'15%',
    alignSelf: 'center'
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
