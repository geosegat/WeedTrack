import {Trash2} from 'lucide-react-native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import AppText from '../AppText';

interface TransactionItemProps {
  value: number;
  date: string;
  onDelete: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  value,
  date,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.gap}>
        <View style={styles.flexRow}>
          <AppText>Compra de </AppText>
          <AppText weight="500">R$ {value.toFixed(2)}</AppText>
        </View>
        <AppText size={14} color="#a29c95">
          Data: {date}
        </AppText>
      </View>

      <View style={styles.flexRow}>
        <TouchableOpacity onPress={onDelete}>
          <Trash2 size={20} color={'red'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#232121',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  flexRow: {flexDirection: 'row'},
  gap: {gap: 6},
});
