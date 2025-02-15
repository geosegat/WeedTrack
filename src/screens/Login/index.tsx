import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProps} from '../../types/navigation';
import AppText from '../../components/AppText';

const STORAGE_KEY = '@user_name';

const Login = ({navigation}: NavigationProps) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!name.trim()) {
      return;
    }

    setIsLoggingIn(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, name);
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
        setIsLoggingIn(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao salvar nome:', error);
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    const checkUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedName) {
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
          return;
        }
      } catch (error) {
        console.error('Erro ao carregar nome:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserName();
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.boxText}>
        <AppText weight="500" size={25}>
          Digite um nome ou apelido
        </AppText>
      </View>
      <TextInput
        style={styles.styleInput}
        placeholder="Digite aqui seu nome ou apelido"
        placeholderTextColor="gray"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoggingIn}>
        {isLoggingIn ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <AppText color="black" size={18}>
            Acessar
          </AppText>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 25,
    justifyContent: 'center',
  },
  styleInput: {
    color: 'white',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  boxText: {alignItems: 'center'},
  button: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 50,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
