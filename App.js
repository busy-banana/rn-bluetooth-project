// // const instructions = Platform.select({
// //   ios: 'Press Cmd+R to reload,\n' +
// //     'Cmd+D or shake for dev menu',
// //   android: 'Double tap R on your keyboard to reload,\n' +
// //     'Shake or press menu button for dev menu',
// // });
/*  
  BluetoothSerial API
  isEnabled()
  list()
  on('',function)
  requestEnable()
  enable()
  disable()
  discoverUnpairedDevices()
  cancelDiscovery()
  pairDevice(id)
  connect(id)
  disconnect()
  write(msg)
*/

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import Toast from '@remobile/react-native-toast';
import BluetoothSerial from 'react-native-bluetooth-serial';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      devices: [],
      connected: false,
    }
  }
  
  componentWillMount() {
    this.getInitData();
  }

  getInitData() {
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ]).then((values) => {
      const [isEnabled, devices] = values;
      this.setState({isEnabled, devices});
      console.log(this.state);
    }).catch((err) => {
      Toast.showShortTop('系统异常，请稍后再试');
      console.log(err)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          蓝牙模块 DEMO12
        </Text>
        <Button
          onPress={() => Toast.showShortTop('Perfect')}
          title='Click it'
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});