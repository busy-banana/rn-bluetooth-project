import React, { Component} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Modal,
  // Dimensions,
} from 'react-native';

export default class DataDebug extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    // const {width,height} = Dimensions.get('windows');
    return (
      <View>
        <Modal
          animationType={"fade"}
          transparent={false}
          visible={true}
          onRequestClose={this.props.onBack}
        >
          <View>
            <View>
              <Text style={styles.title}>接收区</Text>
              <Text style={[styles.textContainer, {height: 300}]}>{this.props.readData}</Text>
            </View>
            <View>
              <Text style={styles.title}>发送区</Text>
              <TextInput
                style={[styles.textContainer, {height: 40}]}
                onChangeText={this.props.onChangeText}
                autoCorrect={false}
              />
            </View>
            <View style={{flexDirection: 'row',justifyContent: 'space-around',marginTop: 20}}>
              <Text style={styles.titleBtn} onPress={this.props.sendData}>发送</Text>
            {/* </View> */}
            {/* <View> */}
              <Text style={styles.titleBtn} onPress={this.props.onBack}>返回</Text>
            </View>
          </View>
        </Modal>        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textContainer: {
    borderWidth: 1.5,
    borderColor: '#b1b1b1',
    backgroundColor: '#dfdfdf',
    margin: 6
  },
  title: {
    fontWeight: 'bold',
    color: '#4ec9ab',
  },
  titleBtn: {
    fontWeight: 'bold',
    fontSize: 16,
    width: 50,
    height:25,
    backgroundColor: '#4ec9ab',
    borderWidth: 1,
    // borderColor: '#4ec9ab'
  },
});