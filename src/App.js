/*  
  BluetoothSerial API
  isEnabled()
  list()   return paired devices only in Andoid
  on('',function)
  connect(id)
  disconnect()
  write(msg)

  enable()    Android
  disable()   Android
  requestEnable()   Android
  discoverUnpairedDevices()   Android
  cancelDiscovery()   Android
  pairDevice(id)    Android
*/

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Switch,
  TouchableHighlight,
  TouchableOpacity,
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
      isLeft: true,
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
    }).catch((err) => {
      Toast.showShortTop('系统异常，请稍后再试');
      console.log(err)
    })
  }

  changeSwitch() {
    if(this.state.isEnabled == false){
      this.enable();
    }else{
      this.disable();
    }
  }

  //Only Android
  enable() {
    BluetoothSerial.enable().then((res) => {
      this.setState({isEnabled: true})
    }).catch((err) => {
      Toast.showShortTop(err.message)
    })
  }

  //Only Android
  disable() {
    BluetoothSerial.disable().then((res) => {
      this.setState({isEnabled: false})
    }).catch((err) => {
      Toast.showShortTop(err.message)
    })
  }

  showPairedDevices() {
    if(this.state.isLeft == false){
      this.setState({isLeft: true});
    }
    const deviceList = this.state.devices;
  }

  showUnPairedDevices() {
    if(this.state.isLeft == true){
      this.setState({isLeft: false});
    }
  }


  render() {
    return (
      <View style={styles.container}>
        { Platform.OS == 'android' ? 
          <View style={styles.header}>
            <Text style={styles.bluetoothTitle}>
              {this.state.isEnabled == true ? '蓝牙已开启' : '蓝牙已关闭'}
            </Text>
            <Switch
              onValueChange = {this.changeSwitch.bind(this)}
              value = {this.state.isEnabled}
            /> 
          </View>  : null }
        
        { Platform.OS == 'android' ? 
          <View style={styles.tab}>
            <TouchableOpacity
              style={[styles.tabView, this.state.isLeft == true && styles.tabSelect]}
              onPress={this.showPairedDevices.bind(this)}
            >
              <Text style={styles.tabTitle}>
                已匹配
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabView, this.state.isLeft == false && styles.tabSelect]}
              onPress={this.showUnPairedDevices.bind(this)}
            >
              <Text style={styles.tabTitle}>
                未匹配
              </Text>
            </TouchableOpacity>
          </View> : null }

        { Platform.OS == 'android' ? 
          <View style={styles.bottom}>
            <Text style={styles.bottomTitle}>
                搜索设备
            </Text>
          </View> : null }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',    
    height:60,
    backgroundColor: '#4ec9ab',
  },
  tab: {
    flexDirection: 'row',
    backgroundColor: '#4ec9ab',
    height:60,
  },
  bluetoothTitle: {
    color: '#fff',
    fontSize: 15,
  },
  tabTitle: {
    color: '#fff',
    fontSize: 18,
  },
  tabView: {
    flex: 0.5,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,    
    borderColor: 'transparent',
  },
  tabSelect: {
    borderBottomWidth: 4,
    borderColor: '#1c86ee',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',    
    backgroundColor: '#f0f0f0',
    height: 60
  },
  bottomTitle: {
    color: '#4ec9ab',
    fontSize: 18,
    fontWeight: 'bold'
  }
});