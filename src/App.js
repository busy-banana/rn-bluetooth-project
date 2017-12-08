/*  
  BluetoothSerial API
  isEnabled()
  list()   return paired devices only in Andoid
  on('',function)
  connect(id)
  disconnect()
  write(msg)
  readFromDevice()

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
  Switch,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import DeviceList from './components/deviceList';
import Toast from '@remobile/react-native-toast';
import BluetoothSerial from 'react-native-bluetooth-serial';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      devices: [],
      unpairedDevices: [],
      isLeft: true,
      connectedDevice: {},
      discovering: false,
    }
  }
  
  componentWillMount() {
    this.getInitData();

    BluetoothSerial.on('bluetoothEnabled',() => {
      BluetoothSerial.list().then((devices) => {
        this.setState({ devices });
        Toast.showShortTop('蓝牙已开启');
      }).catch((err) => {
        Toast.showShortTop(`系统异常，请稍后再试 ${err.message}`);
      });
    });
    BluetoothSerial.on('bluetoothDisabled',() => {
      this.setState({devices: []});
      Toast.showShortTop('蓝牙已关闭');
    });
    BluetoothSerial.on('error',(err) => console.log(`Error: ${err.message}`));
    BluetoothSerial.on('connectionLost',() => {
      if (this.state.connectedDevice) {
        Toast.showShortTop(`${this.state.connectedDevice.name} 失去连接`);
      }
        this.setState({ connectedDevice: {} });
    });
    BluetoothSerial.on('read', (res) => {
      if (res) {
        Toast.showShortTop(res);
      }
    });
  }

  //获取初始化数据
  getInitData() {
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ]).then((values) => {
      const [isEnabled, devices] = values;
      this.setState({isEnabled, devices});
    }).catch((err) => {
      Toast.showShortTop(`系统异常，请稍后再试 ${err.message}`);
    })
  }

  //切换蓝牙开关按钮
  changeSwitch() {
    if (this.state.isEnabled == false) {
      this.enable();
    } else {
      this.disable();
    }
  }

  //开启蓝牙 Android Only
  enable() {
    BluetoothSerial.enable().then((res) => {
      this.setState({isEnabled: true})
    }).catch((err) => {
      Toast.showShortTop(err.message)
    })
  }

  //关闭蓝牙 Android Only
  disable() {
    BluetoothSerial.disable().then((res) => {
      this.setState({isEnabled: false})
    }).catch((err) => {
      Toast.showShortTop(err.message)
    })
  }

  //显示已配对设备列表
  showPairedDevices() {
    if (this.state.isLeft == false) {
      this.setState({isLeft: true});
    }
  }

  //显示未配对设备列表
  showUnPairedDevices() {
    if (this.state.isLeft == true) {
      this.setState({isLeft: false});
    }
  }

  //请求连接蓝牙
  connect(device){
    BluetoothSerial.connect(device.id).then((res) => {
      Toast.showShortTop(`${device.name} 连接成功`);
      this.setState({
        connectedDevice: {id: device.id, name: device.name},
      });
    }).catch((err) => {
      Toast.showShortTop(`${device.name} 连接失败 ${err.message}`)
    })

    // BluetoothSerial.isConnected().then((res) => {
    //   if (res) {
    //       console.log('蓝牙已连接');
    //   } else {
    //     BluetoothSerial.connect(device.id).then((res) => {
    //       Toast.showShortTop(`${device.name} 连接成功`);
    //       this.setState({
    //         connectedDevice: {id: device.id, name: device.name},
    //       });
    //     }).catch((err) => {
    //       Toast.showShortTop(`${device.name} 连接失败 ${err.message}`)
    //     });
    //   }
    // });
      
    // if (Platform.OS == 'android') {
    // } else {
    //   Toast.showShortTop('手机平台不匹配，无法连接');      
    // }
  }

  //请求配对蓝牙 Android Only
  pairDevice(device){
    BluetoothSerial.pairDevice(device.id).then((res) => {
      if (res) {
        let devices = this.state.devices;
        devices.push(device);
        Toast.showShortTop(`${device.name} 配对成功`);
        this.setState({
          devices,
          unpairedDevices: this.state.unpairedDevices.filter((e) => {return e.id != device.id})
        });
      } else {
        Toast.showShortTop(`${device.name} 配对失败`)
      }
    }).catch((err) => {
      Toast.showShortTop(err.message)  
    }) 
  }

  //点击设备列表，连接/配对设备
  clickDeviceList(device) {
    if (this.state.isLeft == true) {
      if (this.state.connectedDevice && this.state.connectedDevice.id == device.id) {
        return false;
      } else {
        this.connect(device);
      }
    } else {
      this.pairDevice(device);      
    }
  }

  //搜索可配对设备 Android Only
  discoverUnpairedDevices(){
    if (this.state.discovering) {
      return false;
    } else if (!this.state.isEnabled) {
      Toast.showShortTop('请先打开蓝牙')      
    } else {
      this.setState({discovering: true});    
      BluetoothSerial.discoverUnpairedDevices().then((unpairedDevices) => {
          this.setState({ unpairedDevices, discovering: false })
      }).catch((err) => {
        Toast.showShortTop(err.message)  
      }) 
    }  
  }

  //取消搜索 Android Only
  cancelDiscovery(){
    if (this.state.discovering) {
      BluetoothSerial.cancelDiscovery().then((res) => {
        this.setState({discovering: false})
      }).catch((err) => {
        Toast.showShortTop(err.message)  
      }) 
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


        {!this.state.isLeft && this.state.discovering ? 
          (<View style={styles.loading}>
              <ActivityIndicator
                color='#4ec9ab'
                size={45}
                style={{marginBottom: 15}}              
              />
              <Text onPress={this.cancelDiscovery.bind(this)} style={styles.cancelBtn}>取消搜索</Text>
            </View>
          ) : null
        }
      
        <DeviceList
          devices={this.state.isLeft == true ? this.state.devices : this.state.unpairedDevices}
          showConnectedIcon={this.state.isLeft == true ? true : false}
          connectedId={this.state.connectedDevice.id || ''}
          onPressCallback={this.clickDeviceList.bind(this)}
        />

        { Platform.OS == 'android' && !this.state.isLeft ? 
          <View style={styles.bottom}>
            <Text style={styles.bottomTitle} onPress={this.discoverUnpairedDevices.bind(this)}>
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
  },
  loading: {
    marginTop: 160,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#4ec9ab',
    color: '#fff',
    fontSize: 15,
    padding: 8,
    borderRadius: 4
  }
});