import React, {useState, useEffect} from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppText from '../../components/AppText';
import ButtonValue from '../../components/ButtonValue';
import TransactionItem from '../../components/TransactionItem';
import {getFormattedDate} from '../../utils/getFormattedDate';
import TotalSpent from '../../components/TotalSpent';
import {NavigationProps} from '../../types/navigation';
import {useUsers} from '../../hooks/useUsers';
import {Save} from 'lucide-react-native';
import SaveDataModal from '../../components/SaveDataModal';
import {supabase} from '../../services/supabase';

const STORAGE_KEY = '@transactions_list';
const USERNAME_KEY = '@user_name';

const Home = ({navigation}: NavigationProps) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [valuesList, setValuesList] = useState<
    {id: string; value: number; date: string}[]
  >([]);
  const {users} = useUsers();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEmailValidated, setIsEmailValidated] = useState(false);

  const addValueToList = (newValue: number) => {
    const newTransaction = {
      id: Math.random().toString(),
      value: newValue,
      date: getFormattedDate(),
    };
    setValuesList(prevList => [newTransaction, ...prevList]);
  };

  const handleDelete = (id: string) => {
    setValuesList(prevList => prevList.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    if (!value.trim()) return;
    Keyboard.dismiss();
    addValueToList(parseFloat(value));
    setValue('');
  };

  const handleEditName = async () => {
    Alert.alert('Alterar Nome', 'Deseja realmente alterar seu ? ', [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Sim',
        onPress: async () => {
          await AsyncStorage.removeItem(USERNAME_KEY);
          navigation.reset({index: 0, routes: [{name: 'Login'}]});
        },
      },
    ]);
  };

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem(USERNAME_KEY);
        if (storedName) setUserName(storedName);
      } catch (error) {
        console.error('Erro ao carregar nome do usuário:', error);
      }
    };
    loadUserName();
  }, []);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTransactions) setValuesList(JSON.parse(storedTransactions));
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
      }
    };
    loadTransactions();
  }, []);

  useEffect(() => {
    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(valuesList));
      } catch (error) {
        console.error('Erro ao salvar transações:', error);
      }
    };
    saveTransactions();
  }, [valuesList]);

  // Calcula o total gasto
  const getTotalSpent = () =>
    valuesList.reduce((acc, item) => acc + item.value, 0);

  // Verifica se o usuário já vinculou sua conta (tem email cadastrado na tabela "users")
  useEffect(() => {
    const checkUserEmailValidation = async () => {
      const {data: sessionData, error: sessionError} =
        await supabase.auth.getSession();
      if (sessionError) {
        console.error('Erro ao pegar sessão:', sessionError);
        return;
      }
      const session = sessionData?.session;
      if (session?.user) {
        const {data, error} = await supabase
          .from('users')
          .select('email')
          .eq('id', session.user.id)
          .single();
        if (error) {
          console.error('Erro ao buscar usuário:', error);
          setIsEmailValidated(false);
        } else {
          setIsEmailValidated(data.email ? true : false);
        }
      } else {
        setIsEmailValidated(false);
      }
    };

    checkUserEmailValidation();
  }, [users]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonEditName}>
        <AppText size={24} weight="500">
          Olá, {userName ? userName : 'Usuário'}!
        </AppText>
        <TouchableOpacity onPress={handleEditName}>
          <AppText>Trocar nome</AppText>
        </TouchableOpacity>
      </View>

      <TotalSpent valuesList={valuesList} />

      <View>
        <TextInput
          placeholderTextColor="gray"
          placeholder="Digite um valor"
          style={styles.styleInput}
          keyboardType="numeric"
          value={value}
          onChangeText={setValue}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
        <ButtonValue onValueSelect={addValueToList} />
      </View>

      <View style={styles.containerHistory}>
        <AppText size={18} weight="500">
          Histórico de Compras
        </AppText>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          {/* Ícone fica verde se a conta estiver vinculada, laranja se não */}
          <Save color={isEmailValidated ? 'green' : 'orange'} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={valuesList}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <TransactionItem
            value={item.value}
            date={item.date}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />

      <SaveDataModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        totalSpent={getTotalSpent()}
        onUserAuthenticated={email => {
          console.log('Usuário autenticado:', email);
          setIsEmailValidated(true);
        }}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 25,
    gap: 24,
  },
  buttonEditName: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  styleInput: {
    color: 'white',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  containerHistory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
