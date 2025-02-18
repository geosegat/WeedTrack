import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';

const SUPABASE_URL = 'https://inzkbvdqawbvbecvuwdn.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluemtidmRxYXdidmJlY3Z1d2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NDk5NDYsImV4cCI6MjA1NTIyNTk0Nn0.NfIMpF8mUA6rHVaPk3gVhC9GtQd5U0zTv8pIttjjbvc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
