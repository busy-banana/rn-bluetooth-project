import React, { Component} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
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
              <TouchableOpacity
                onPress={this.props.onWriteString}  
                style={styles.titleBtn}
                activeOpacity={0.6}
              >
                <Text style={styles.btnText}>发送(Str)</Text>              
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.props.onWriteText}  
                style={styles.titleBtn}
                activeOpacity={0.6}
              >
                <Text style={styles.btnText}>发送(Text)</Text>              
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.props.onWriteHex}  
                style={styles.titleBtn}
                activeOpacity={0.6}
              >
                <Text style={styles.btnText}>发送(Hex)</Text>              
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.props.onBack}
                style={styles.titleBtn}
                activeOpacity={0.6}
              >
                <Text style={styles.btnText}>返回</Text>
              </TouchableOpacity>
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
    margin: 6,
    color: '#000',
    fontSize: 12
  },
  title: {
    fontWeight: 'bold',
    color: '#4ec9ab',
  },
  titleBtn: {
    width: 80,
    height:30,
    backgroundColor: '#4ec9ab',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#fff'
  }
});