import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {EyeIcon, EyeOffIcon} from 'lucide-react-native';
import AppText from '../AppText';

interface TotalSpentProps {
  valuesList: {value: number}[];
}

const TotalSpent: React.FC<TotalSpentProps> = ({valuesList}) => {
  const [isHidden, setIsHidden] = useState(false);

  const totalSpent = valuesList
    .reduce((acc, curr) => acc + curr.value, 0)
    .toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText size={20}>Total Gasto</AppText>
        <AppText size={20} weight="500">
          {isHidden ? 'R$ *****' : `R$ ${totalSpent}`}
        </AppText>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsHidden(!isHidden)}>
        {isHidden ? (
          <EyeIcon color="white" size={20} />
        ) : (
          <EyeOffIcon color="white" size={20} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TotalSpent;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#232121',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    gap: 4,
  },
  button: {
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
});
