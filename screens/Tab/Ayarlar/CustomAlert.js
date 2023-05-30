import React, {useState} from 'react';
import {View, TextInput, Button} from 'react-native';
import {Modal} from 'react-native';

const CustomAlert = ({isVisible, onConfirm, onCancel}) => {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    onConfirm(inputValue);
    setInputValue('');
  };

  return (
    <Modal isVisible={isVisible}>
      <View>
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Enter your input"
        />
        <Button title="Confirm" onPress={handleConfirm} />
        <Button title="Cancel" onPress={onCancel} />
      </View>
    </Modal>
  );
};
export default CustomAlert;
