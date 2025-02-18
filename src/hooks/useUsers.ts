import {useEffect, useState} from 'react';
import {supabase} from '../services/supabase';

export const useUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const {data, error: fetchError} = await supabase
        .from('users')
        .select('*');

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setUsers(data);
        console.log('Dados dos usuários:', data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return {users, loading, error};
};
