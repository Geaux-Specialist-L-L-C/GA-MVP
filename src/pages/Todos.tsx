import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

interface Todo {
  id: number;
  title: string;
  // Add other todo properties as needed
}

function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function getTodos() {
      const { data, error } = await supabase.from('todos').select('*');
      
      if (error) {
        console.error('Error fetching todos:', error);
        return;
      }

      if (data && data.length > 0) {
        setTodos(data);
      }
    }

    getTodos();
  }, []);

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;