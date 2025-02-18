// SaveDataModal.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AppText from '../AppText';
import {supabase} from '../../services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const USERNAME_KEY = '@user_name';

interface SaveDataModalProps {
  visible: boolean;
  onClose: () => void;
  onUserAuthenticated: (email: string) => void;
  totalSpent: number;
}

const SaveDataModal = ({
  visible,
  onClose,
  onUserAuthenticated,
  totalSpent,
}: SaveDataModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Informe email e senha.');
      return;
    }

    try {
      // Tenta o login com email e senha
      const {data: signInData, error: signInError} =
        await supabase.auth.signInWithPassword({email, password});
      let user = null;

      if (signInError || !signInData.user) {
        // Se o login falhar, tenta o cadastro (sign up)
        const {data: signUpData, error: signUpError} =
          await supabase.auth.signUp({email, password});
        if (signUpError) {
          Alert.alert('Erro', signUpError.message);
          return;
        }
        user = signUpData.user;
      } else {
        user = signInData.user;
      }

      if (!user) {
        Alert.alert('Erro', 'Usuário não encontrado.');
        return;
      }

      // Recupera o nome salvo no AsyncStorage
      const storedName =
        (await AsyncStorage.getItem(USERNAME_KEY)) || 'Usuário';

      // Faz o upsert na tabela "users"
      const {error: upsertError} = await supabase.from('users').upsert({
        id: user.id, // ID do usuário vindo do Supabase Auth
        email: user.email, // Email validado
        name: storedName, // Nome que o usuário informou localmente
        total: totalSpent, // Total gasto (passado como prop)
      });

      if (upsertError) {
        Alert.alert('Erro ao salvar dados', upsertError.message);
        return;
      }

      Alert.alert('Sucesso', 'Conta vinculada com sucesso!');
      onUserAuthenticated(email);
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      Alert.alert('Erro', errorMessage);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Informe email e senha</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <AppText>Cancelar</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAuth}>
              <AppText>Salvar</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
});

export default SaveDataModal;
