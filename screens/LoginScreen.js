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
  AsyncStorage
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
    }
  }

  async savePhoneNumber(phone) {
    await AsyncStorage.setItem('phone', phone);
    this.setState({ loading: false });
    this.props.navigation.navigate('Home');
  }

  processInput() {
    const { phone } = this.state;

    if (!phone) {
      console.log(phone);
      Alert.alert(
        'You must provide a phone number.',
        '',
        [
          { text: 'OK' },
        ],
        { cancelable: true }
      );
    } else {
      this.setState({ loading: true });
      this.savePhoneNumber(phone);
    }
  }

  render() {
    const { navigation } = this.props;

    return (
      <Block flex>
        <Text style={[styles.title, styles.titleText]}>T-Food</Text>
        <KeyboardAvoidingView behavior='padding' enabled style={{ justifyContent: 'flex-end', flex: 1, marginHorizontal: 20, marginVertical: 5 }}>
          <Text style={[styles.titleText, {fontSize: 20, marginTop: 20}]}>Phone number:</Text>
          <View style={{marginVertical: 10, width: width - 40, backgroundColor: 'white' }}>
            <TextInput
              style={{ height: 50, borderBottomWidth: 1, paddingHorizontal: 10 }}
              onChangeText={text => this.setState({ phone: text })}
              value={this.state.phone}
              keyboardType='phone-pad'
              autoCompleteType='off'
            />
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
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 5,
    shadowOpacity: 0,
    marginVertical: 10
  },
  buttonText: {
    color: 'black',
    fontSize: 16
  },
  title: {
    marginTop:'5%'
  },
  subtitle: {
    marginTop: 20
  },
  signInButton: {
    width: 250,
    height: 60,
    resizeMode: 'contain',
  },
  titleText: {
    fontSize: 60,
    color: 'white',
  },
  subtitleText: {
    fontSize: 24,
    color: 'white',
  },
});
