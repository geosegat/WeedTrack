import {StyleSheet, Text, TouchableOpacity, FlatList, View} from 'react-native';
import React from 'react';

const values = [5, 10, 15, 20, 30, 50, 100];

interface ButtonValueProps {
  onValueSelect: (value: number) => void;
}

const ButtonValue: React.FC<ButtonValueProps> = ({onValueSelect}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={values}
        horizontal
        keyExtractor={item => item.toString()}
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => onValueSelect(item)}>
            <Text style={styles.text}>R$ {item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ButtonValue;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingVertical: 10,
  },
  list: {
    gap: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#086c4c',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
