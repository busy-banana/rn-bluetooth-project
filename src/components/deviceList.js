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

  handleDevices(devices, showConnectedIcon) {
    return (
      
    )

    
  }

  render() {
    return (
      <ScrollView>
        <View>
          {this.handleDevices()}
        </View>
      </ScrollView>
    )
  }
}