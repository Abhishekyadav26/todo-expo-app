import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Animated , Modal, Pressable, StatusBar } from 'react-native';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');

  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'done'

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'done') return task.completed;
    return true; // 'all'
  });

  const [editingTask, setEditingTask] = useState(null); // the task being edited
const [editText, setEditText] = useState('');

const openEditModal = (task) => {
  setEditingTask(task);
  setEditText(task.text);
};

const closeEditModal = () => {
  setEditingTask(null);
  setEditText('');
};

const saveEdit = () => {
  const trimmed = editText.trim();
  if (!trimmed) return;

  setTasks(prev =>
    prev.map(t =>
      t.id === editingTask.id ? { ...t, text: trimmed } : t
    )
  );
  closeEditModal();
};

  // Load tasks from storage when app opens
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem('tasks');
        if (stored !== null) {
          setTasks(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load tasks:', e);
      }
    };

    loadTasks();
  }, []); // empty deps = runs once on mount

  // Save tasks to storage whenever tasks change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (e) {
        console.error('Failed to save tasks:', e);
      }
    };

    saveTasks();
  }, [tasks]); // runs every time tasks changes

  const addTask = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return; // don't add empty tasks

    const newTask = {
      id: Date.now().toString(), // unique id as string (FlatList needs this)
      text: trimmed,
      completed: false,
    };

    setTasks(prev => [newTask, ...prev]); // newest task at top
    setInputText(''); // clear input after adding
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const FILTERS = ['all', 'active', 'done'];

  function FilterTabs({ current, onChange }) {
    return (
      <View style={styles.tabRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.tab, current === f && styles.tabActive]}
            onPress={() => onChange(f)}
          >
            <Text style={[styles.tabText, current === f && styles.tabTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <Text style={styles.title}>My Tasks</Text>
      <Text style={styles.taskCount}>
        {tasks.filter(t => !t.completed).length} remaining
      </Text>

      <FilterTabs current={filter} onChange={setFilter} />
      
      {/* Input Row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          placeholderTextColor="#aaa"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTask} // pressing Enter on keyboard adds task
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
            onEdit={() => openEditModal(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Add one above!</Text>
        }
        contentContainerStyle={tasks.length === 0 && styles.emptyContainer}
      />
      {/* Edit Modal */}
<Modal
  visible={editingTask !== null}
  transparent
  animationType="slide"
  onRequestClose={closeEditModal}
>
  <Pressable style={styles.modalOverlay} onPress={closeEditModal}>
    <Pressable style={styles.modalSheet}>
      <View style={styles.modalHandle} />
      <Text style={styles.modalTitle}>Edit Task</Text>

      <TextInput
        style={styles.modalInput}
        value={editText}
        onChangeText={setEditText}
        autoFocus
        multiline
        returnKeyType="done"
        onSubmitEditing={saveEdit}
      />

      <View style={styles.modalActions}>
        <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  </Pressable>
</Modal>
    </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}


function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity style={styles.deleteAction} onPress={onDelete}>
        <Animated.Text style={[styles.deleteActionText, { transform: [{ scale }] }]}>
          Delete
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <View style={styles.taskRow}>
        <TouchableOpacity style={styles.taskLeft} onPress={onToggle}>
          <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
            {task.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.taskText, task.completed && styles.taskTextDone]}>
            {task.text}
          </Text>
        </TouchableOpacity>

        {/* Edit button */}
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Text style={styles.editIcon}>✎</Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  taskCount: {
    fontSize: 14,
    color: '#888',
    marginTop: -18,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'flex-end',
},
modalSheet: {
  backgroundColor: '#fff',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  padding: 24,
  paddingBottom: 40,
},
modalHandle: {
  width: 40,
  height: 4,
  backgroundColor: '#e0e0e0',
  borderRadius: 2,
  alignSelf: 'center',
  marginBottom: 20,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#1a1a1a',
  marginBottom: 16,
},
modalInput: {
  backgroundColor: '#f5f5f5',
  borderRadius: 12,
  padding: 16,
  fontSize: 16,
  color: '#1a1a1a',
  minHeight: 80,
  textAlignVertical: 'top', // Android: start text from top in multiline
},
modalActions: {
  flexDirection: 'row',
  gap: 12,
  marginTop: 20,
},
cancelButton: {
  flex: 1,
  paddingVertical: 14,
  borderRadius: 12,
  backgroundColor: '#f0f0f0',
  alignItems: 'center',
},
cancelButtonText: {
  fontSize: 16,
  color: '#888',
  fontWeight: '500',
},
saveButton: {
  flex: 1,
  paddingVertical: 14,
  borderRadius: 12,
  backgroundColor: '#6C63FF',
  alignItems: 'center',
},
saveButtonText: {
  fontSize: 16,
  color: '#fff',
  fontWeight: 'bold',
},
    tabRow: {
  flexDirection: 'row',
  marginBottom: 20,
  backgroundColor: '#ececec',
  borderRadius: 12,
  padding: 4,
},
deleteAction: {
  backgroundColor: '#ff4757',
  justifyContent: 'center',
  alignItems: 'flex-end',
  paddingHorizontal: 24,
  marginBottom: 10,
  borderRadius: 12,
},
deleteActionText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 15,
},
editButton: {
  padding: 6,
  marginLeft: 8,
},
editIcon: {
  fontSize: 18,
  color: '#aaa',
},
tab: {
  flex: 1,
  paddingVertical: 8,
  alignItems: 'center',
  borderRadius: 10,
},
tabActive: {
  backgroundColor: '#fff',
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2, // Android shadow
},
tabText: {
  fontSize: 14,
  color: '#888',
  fontWeight: '500',
},
tabTextActive: {
  color: '#6C63FF',
  fontWeight: 'bold',
},




  // Input row
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Task item
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#6C63FF',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  taskText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 16,
    color: '#ccc',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#bbb',
    fontSize: 15,
    textAlign: 'center',
  },
});



