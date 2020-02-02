import React from "react";
import {
  StyleSheet,
  Dimensions,
  Image,
  View,
  Text,
  TouchableOpacity
} from "react-native";

import Colors from '../constants/Colors';

import Loading from '../components/Loading';

const { height, width } = Dimensions.get('screen');

const images = [
  {
    source: require("../assets/images/map.png"),
    height: height,
    width: 5528 / 7568 * height // Pre defined calculation for width according to image dimension
  },
];

class MapScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isImageViewVisible: false,
      loading: true
    };
  }

  async componentDidMount() {
    this.setState({ loading: false });
  }

  onPressVenue = () => {
    this.setState({ isImageViewVisible: !this.state.isImageViewVisible });
  }

  render() {
    if (this.state.loading) {
      return (<Loading />);
    } else {
      return (
        <View style={styles.container}>
          <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={require("../assets/images/map.png")}
                resizeMode='contain'
                style={{ height: width * 480 / 850, width: width }}
              />
          </TouchableOpacity>
        </View>
      );
    }
  }
}

MapScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'white'
  },
  titleText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    padding: 15,
  }
});

export default MapScreen;
