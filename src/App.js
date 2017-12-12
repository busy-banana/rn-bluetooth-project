/**  
 * BluetoothSerial API
 * isEnabled()
 * list()   return paired devices only in Andoid
 * on('',function)
 * connect(id)
 * disconnect()
 * write(msg)
 * readFromDevice()
 * read()
 * enable()    Android
 * disable()   Android
 * requestEnable()   Android
 * discoverUnpairedDevices()   Android
 * cancelDiscovery()   Android
 * pairDevice(id)    Android
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
  ActivityIndicator,
  Modal,
} from 'react-native';
import DeviceList from './modules/deviceList';
import DataDisplay from './modules/dataDisplay';
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
      discovering: false, //设备搜索状态
      modalVisible: false,
      deviceReady: {}, //点击设备列表，保存设备信息
      // isDataDisplay: false, //是否展示数据调试页面
      isDataDisplay: true, //是否展示数据调试页面
      readData: '', 
      textInputValue: '',
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
    BluetoothSerial.on('read', this.handleReadData);
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
        modalVisible: false
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

  //搜索可配对设备 Android Only
  discoverUnpairedDevices() {
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
  cancelDiscovery() {
    if (this.state.discovering) {
      BluetoothSerial.cancelDiscovery().then((res) => {
        this.setState({discovering: false})
      }).catch((err) => {
        Toast.showShortTop(err.message)  
      }) 
    }
  }

   /**
   * 向外围设备发送数据
   * @param  {String} message
   */
  write (message) {
    if (!this.state.connected) {
      Toast.showShortBottom('You must connect to device first')
    }

    BluetoothSerial.write(message)
    .then((res) => {
      Toast.showShortBottom('Successfuly wrote to device')
      this.setState({ connected: true })
    })
    .catch((err) => Toast.showShortBottom(err.message))
  }

  writePackets (message, packetSize = 64) {
    const toWrite = iconv.encode(message, 'cp852')
    const writePromises = []
    const packetCount = Math.ceil(toWrite.length / packetSize)

    for (var i = 0; i < packetCount; i++) {
      const packet = new Buffer(packetSize)
      packet.fill(' ')
      toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize)
      writePromises.push(BluetoothSerial.write(packet))
    }

    Promise.all(writePromises)
    .then((result) => {
    })
  }

  //处理接受数据
  handleReadData(readData) {
    console.log(readData);
      if (!!readData) {
        this.setState({readData});
      }
  }

  //点击设备列表，连接/配对设备
  clickDeviceList() {
    const device = this.state.deviceReady || {};
    if (this.state.connectedDevice && this.state.connectedDevice.id == device.id) {
      Toast.showShortTop(`${device.name} 已连接`)
    } else if (this.state.connectedDevice.id) {
      BluetoothSerial.disconnect()
        .then(() => {this.connect(device)})
        .catch((err) => Toast.showShortTop(err.message))
    } else {
      this.connect(device);
    }
  }

  //打开Modal浮层
  onRequestOpen(deviceReady) {
    if (!this.state.modalVisible && this.state.isLeft) {
      this.setState({deviceReady, modalVisible: true});
    } else if (!this.state.isLeft) {
      this.pairDevice(deviceReady);      
    }
  }

  //关闭Modal浮层
  onRequestClose() {
    if (this.state.modalVisible) {
      this.setState({modalVisible: false});
    }
  }

  //打开数据调试页面
  showDataDisplay() {
    if (!this.state.isDataDisplay) {
      this.setState({isDataDisplay: true})
    }
  }

  //返回首页
  onBack() {
    if (this.state.isDataDisplay) {
      this.setState({isDataDisplay: false});
    }
  }

  //同步输入框的值
  handleTextInputChange(textInputValue) {
    this.setState({textInputValue});
  }

  render() {
    const device123 = [{id: 666662, name:'device1'},{id: 666666, name:'device3'},{id: 666661, name:'device2'}];
    const dataDisplay = this.state.isDataDisplay ? (
      <DataDisplay
        readData={this.state.readData}
        sendData={this.write.bind(this)}
        onBack={this.onBack.bind(this)}
        onChangeText={this.handleTextInputChange.bind(this)}
      />) : null;
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
          devices={device123}
          // devices={this.state.isLeft == true ? this.state.devices : this.state.unpairedDevices}
          showConnectedIcon={this.state.isLeft == true ? true : false}
          // connectedId={this.state.connectedDevice.id || ''}
          connectedId='666666'
          onPressCallback={this.onRequestOpen.bind(this)}
        />

        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.onRequestClose.bind(this)}}
        >
          <TouchableOpacity
            style={styles.modalView}
            onPress={this.onRequestClose.bind(this)}
          >
            <View style={styles.modalSelect}>
              <View style={{borderRightColor: '#b1b1b1',borderRightWidth: 1}}>
                <Text style={styles.modalTitle} onPress={this.clickDeviceList.bind(this)}>
                  连接
                </Text>
              </View>
              <View>                
                <Text style={styles.modalTitle} onPress={this.showDataDisplay.bind(this)}>
                  调试
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {dataDisplay}

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
  },
  modalView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(177, 177, 177, 0.4)',
  },
  modalSelect: {
    width: 180,
    height: 70,
    flexDirection: 'row',
    backgroundColor:'#fff',
    borderRadius: 6,
    alignItems:'center',
    justifyContent:'center'
  },
  modalTitle: {
    width: 88,
    textAlign: 'center',
  }
});
