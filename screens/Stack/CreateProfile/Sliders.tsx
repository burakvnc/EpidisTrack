/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Slider} from '@miblanchard/react-native-slider';
import {StyleSheet, View, Text} from 'react-native';

class Sliders extends React.Component {
  state = {
    value: 1,
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.buttonOutlineText}>
          Yaşınızı Seçin: {this.state.value}
        </Text>
        <Slider
          minimumValue={1}
          animationType="timing"
          thumbStyle={{backgroundColor: '#181818'}}
          trackClickable
          trackStyle={{backgroundColor:'#eee'}}
          containerStyle={styles.input}
          maximumValue={100}
          step={1}
          value={this.state.value}
          onValueChange={value => this.setState({value})}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '85%',
    alignContent: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#0a2f35',
    borderRadius: 10,
    height: 45,
    marginBottom: 15,
    borderColor: '#eee',
  },
  buttonOutlineText: {
    color: '#eee',
    marginBottom:10,
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'CaviarDreams',
  },
});

export default Sliders;
