import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  Text,
  Image
} from 'react-native';

export default class DeviceList extends Component {
  constructor(props) {
    super(props);
  }

  handleDevices(devices, showConnectedIcon, connectedId, onListPress) {
    return (
      devices.map((device,index) => {
        return (
          <TouchableHighlight
            underlayColor='#F5FCFF'
            style={styles.list}
            key={device.id+index}
            onPress={() => onListPress(device)}>
            <View style={styles.listView}>              
              <View style={styles.listLogo}>
                {showConnectedIcon ? 
                  (connectedId == device.id ? 
                    <Text style={styles.pairedLogo}></Text>: null)
                  : null
                }
              </View> 
              <View style={{flexDirection: 'row',alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold',fontSize: 16}}>{device.name}</Text>
                <Text style={{marginLeft: 5,fontSize: 16}}>{device.id}</Text>
              </View>              
            </View>
          </TouchableHighlight>
        )
      })
    )  
  }

  render() {
    const deviceList = this.handleDevices(this.props.devices, this.props.showConnectedIcon, this.props.connectedId, this.props.onPressCallback);
    return (
      <ScrollView>
        <View>
          {deviceList}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  listLogo: {
    width:20,
    height:20,
    marginRight: 10,
    justifyContent: 'center',
  },
  pairedLogo: {
    width: 10,
    height: 10,
    borderWidth: 5,
    borderColor: '#4ec9ab',
    borderRadius: 5,
  }
})