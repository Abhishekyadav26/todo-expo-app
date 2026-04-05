import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { Animated, Modal, Pressable, StatusBar } from "react-native";
import styles from '../styles/styles';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('tasks'); // 'tasks' or 'settings'
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  
  return (
    <>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#1a1a1a" : "#f5f5f5"} />
      {currentScreen === 'tasks' ? (
        <TasksContent onSettingsPress={() => setCurrentScreen('settings')} isDarkMode={isDarkMode} />
      ) : (
        <SettingsContent onBackPress={() => setCurrentScreen('tasks')} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      )}
    </>
  );
}

function TasksContent({ onSettingsPress, isDarkMode }) {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState("all"); // 'all' | 'active' | 'done'
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Load tasks and notification preference from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load tasks
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks));
        }

        // Load notification preference
        const storedNotifications = await AsyncStorage.getItem("notificationsEnabled");
        if (storedNotifications !== null) {
          setNotificationsEnabled(JSON.parse(storedNotifications));
        }
      } catch (e) {
        console.error("Failed to load data:", e);
      }
    };

    loadData();
  }, []);

  // Save tasks to storage whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
        
        // Check for notification triggers
        if (notificationsEnabled) {
          checkNotificationTriggers();
        }
      } catch (e) {
        console.error("Failed to save tasks:", e);
      }
    };

    saveTasks();
  }, [tasks, notificationsEnabled]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "done") return task.completed;
    return true; // 'all'
  });

  const [editingTask, setEditingTask] = useState(null); // the task being edited
  const [editText, setEditText] = useState("");

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditText(task.text);
  };

  const closeEditModal = () => {
    setEditingTask(null);
    setEditText("");
  };

  const saveEdit = () => {
    const trimmed = editText.trim();
    if (!trimmed) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === editingTask.id ? { ...t, text: trimmed } : t)),
    );
    closeEditModal();
  };

  const checkNotificationTriggers = () => {
    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    
    // Milestone notifications
    if (completedTasks.length === 10 && tasks.length === 10) {
      Alert.alert(
        '🎉 Achievement Unlocked!',
        'You\'ve completed 10 tasks! Great job staying productive!',
        [{ text: 'Awesome!', style: 'default' }]
      );
    }
    
    if (activeTasks.length === 0 && tasks.length > 0) {
      Alert.alert(
        '✅ All Tasks Complete!',
        'Congratulations! You\'ve completed all your tasks.',
        [{ text: 'Keep it up!', style: 'default' }]
      );
    }
  };

  const addTask = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newTask = {
      id: Date.now().toString(),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setInputText("");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={[styles.container, isDarkMode && styles.darkContainer]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header with Settings Button */}
        <View style={styles.header}>
          <Text style={[styles.title, isDarkMode && styles.darkTitle]}>My Tasks</Text>
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={onSettingsPress}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.taskCount, isDarkMode && styles.darkTaskCount]}>
          {tasks.filter((t) => !t.completed).length} remaining
        </Text>

        <FilterTabs current={filter} onChange={setFilter} isDarkMode={isDarkMode} />

        {/* Input Row */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Add a new task..."
            placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Task List */}
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={() => toggleTask(item.id)}
              onDelete={() => deleteTask(item.id)}
              onEdit={() => openEditModal(item)}
              isDarkMode={isDarkMode}
            />
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>No tasks yet. Add one above!</Text>
          }
          contentContainerStyle={tasks.length === 0 && styles.emptyContainer}
        />
        
        {/* Footer */}
        <View style={[styles.footerLinks, isDarkMode && styles.darkFooterLinks]}>
          <Text style={[styles.linkText, isDarkMode && styles.darkLinkText]}>© 2024 TodoApp</Text>
        </View>
        
        {/* Edit Modal */}
        <Modal
          visible={editingTask !== null}
          transparent
          animationType="slide"
          onRequestClose={closeEditModal}
        >
          <Pressable style={styles.modalOverlay} onPress={closeEditModal}>
            <Pressable style={[styles.modalSheet, isDarkMode && styles.darkModalSheet]}>
              <View style={styles.modalHandle} />
              <Text style={[styles.modalTitle, isDarkMode && styles.darkModalTitle]}>Edit Task</Text>

              <TextInput
                style={[styles.modalInput, isDarkMode && styles.darkModalInput]}
                value={editText}
                onChangeText={setEditText}
                autoFocus
                multiline
                returnKeyType="done"
                onSubmitEditing={saveEdit}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.cancelButton, isDarkMode && styles.darkCancelButton]}
                  onPress={closeEditModal}
                >
                  <Text style={[styles.cancelButtonText, isDarkMode && styles.darkCancelButtonText]}>Cancel</Text>
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

const FILTERS = ["all", "active", "done"];

function FilterTabs({ current, onChange, isDarkMode }) {
  return (
    <View style={[styles.tabRow, isDarkMode && styles.darkTabRow]}>
      {FILTERS.map((f) => (
        <TouchableOpacity
          key={f}
          style={[styles.tab, current === f && styles.tabActive, isDarkMode && !current === f && styles.darkTab]}
          onPress={() => onChange(f)}
        >
          <Text
            style={[styles.tabText, current === f && styles.tabTextActive, isDarkMode && !(current === f) && styles.darkTabText]}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TaskItem({ task, onToggle, onDelete, onEdit, isDarkMode }) {
  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity style={styles.deleteAction} onPress={onDelete}>
        <Animated.Text
          style={[styles.deleteActionText, { transform: [{ scale }] }]}
        >
          Delete
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <View style={[styles.taskRow, isDarkMode && styles.darkTaskRow]}>
        <TouchableOpacity style={styles.taskLeft} onPress={onToggle}>
          <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
            {task.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text
            style={[
              styles.taskText,
              task.completed && styles.taskTextCompleted,
              isDarkMode && styles.darkTaskText,
              task.completed && isDarkMode && styles.darkTaskTextCompleted,
            ]}
            numberOfLines={2}
          >
            {task.text}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

function SettingsContent({ onBackPress, isDarkMode, setIsDarkMode }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Load notification preference from AsyncStorage
    const loadNotificationPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem('notificationsEnabled');
        if (saved !== null) {
          setNotificationsEnabled(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load notification preference:', error);
      }
    };

    loadNotificationPreference();
  }, []);

  const clearAllTasks = () => {
    Alert.alert(
      'Clear All Tasks',
      'This will permanently delete all your tasks. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('tasks');
              onBackPress(); // Go back to tasks screen
            } catch (error) {
              console.error('Failed to clear tasks:', error);
            }
          },
        },
      ]
    );
  };

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Save dark mode preference to AsyncStorage
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    } catch (error) {
      console.error('Failed to save dark mode preference:', error);
    }
  };

  const toggleNotifications = async () => {
    const newNotificationsEnabled = !notificationsEnabled;
    setNotificationsEnabled(newNotificationsEnabled);
    
    // Save notification preference to AsyncStorage
    try {
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(newNotificationsEnabled));
      
      // Show feedback to user
      if (newNotificationsEnabled) {
        Alert.alert(
          'Notifications Enabled',
          'You will receive task reminders and updates. Note: This is a demo - actual push notifications require additional setup.',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert(
          'Notifications Disabled',
          'You will no longer receive task reminders.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Failed to save notification preference:', error);
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backButton, isDarkMode && styles.darkBackButton]} onPress={onBackPress}>
          <Text style={[styles.backIcon, isDarkMode && styles.darkBackIcon]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Preferences Section */}
      <View style={[styles.section, isDarkMode && styles.darkSection]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>Preferences</Text>
        
        <View style={[styles.settingRow, isDarkMode && styles.darkSettingRow]}>
          <Text style={[styles.settingLabel, isDarkMode && styles.darkSettingLabel]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
        
        <View style={[styles.settingRow, isDarkMode && styles.darkSettingRow]}>
          <Text style={[styles.settingLabel, isDarkMode && styles.darkSettingLabel]}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Data Section */}
      <View style={[styles.section, isDarkMode && styles.darkSection]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>Data</Text>
        
        <TouchableOpacity style={[styles.settingRow, isDarkMode && styles.darkSettingRow]} onPress={clearAllTasks}>
          <Text style={[styles.settingLabel, isDarkMode && styles.darkSettingLabel, { color: '#ff3b30' }]}>
            Clear All Tasks
          </Text>
          <Text style={[styles.settingValue, isDarkMode && styles.darkSettingValue]}>Delete all data</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={[styles.section, isDarkMode && styles.darkSection]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>About</Text>
        
        <View style={[styles.settingRow, isDarkMode && styles.darkSettingRow]}>
          <Text style={[styles.settingLabel, isDarkMode && styles.darkSettingLabel]}>Version</Text>
          <Text style={[styles.settingValue, isDarkMode && styles.darkSettingValue]}>1.0.0</Text>
        </View>
        
        <View style={[styles.settingRow, isDarkMode && styles.darkSettingRow]}>
          <Text style={[styles.settingLabel, isDarkMode && styles.darkSettingLabel]}>Developer</Text>
          <Text style={[styles.settingValue, isDarkMode && styles.darkSettingValue]}>TodoApp Team</Text>
        </View>
      </View>
    </View>
  );
}
