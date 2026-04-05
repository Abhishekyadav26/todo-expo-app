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
import * as Notifications from 'expo-notifications';
import styles from '../styles/styles';

// Configure notification handler with updated API
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('tasks'); // 'tasks' or 'settings'
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [pushToken, setPushToken] = useState('');

  // Initialize notifications
  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions denied');
        return;
      }

      // Get push token (only works in development build, not Expo Go)
      try {
        const token = await Notifications.getExpoPushTokenAsync();
        setPushToken(token.data);
        console.log('Push token:', token.data);
      } catch (tokenError) {
        console.log('Push token not available (expected in Expo Go):', tokenError.message);
        // Set a mock token for demonstration
        setPushToken('expo-go-demo-token');
      }

      // Load saved notification preference
      const saved = await AsyncStorage.getItem('notificationsEnabled');
      if (saved !== null) {
        setNotificationsEnabled(JSON.parse(saved));
      }

      // Load saved dark mode preference
      const savedDarkMode = await AsyncStorage.getItem('darkMode');
      if (savedDarkMode !== null) {
        setIsDarkMode(JSON.parse(savedDarkMode));
      }

    } catch (error) {
      console.log('Failed to initialize notifications (may be expected in Expo Go):', error.message);
      // Still load other settings
      try {
        const saved = await AsyncStorage.getItem('notificationsEnabled');
        if (saved !== null) {
          setNotificationsEnabled(JSON.parse(saved));
        }
        const savedDarkMode = await AsyncStorage.getItem('darkMode');
        if (savedDarkMode !== null) {
          setIsDarkMode(JSON.parse(savedDarkMode));
        }
      } catch (settingError) {
        console.error('Failed to load settings:', settingError);
      }
    }
  };

  // Schedule daily task reminder
  const scheduleTaskReminder = async () => {
    if (!notificationsEnabled) return;

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Try to schedule daily reminder at 9 AM
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📝 Daily Task Reminder',
          body: 'Time to check your tasks and stay productive!',
          data: { screen: 'tasks' },
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });

      console.log('Daily reminder scheduled successfully');
    } catch (error) {
      console.log('Failed to schedule reminder (expected in Expo Go):', error.message);
      // Show an immediate notification as demo in Expo Go
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '📝 Notification Demo',
            body: 'Daily reminders work in development builds. This is a demo!',
            data: { type: 'demo' },
          },
          trigger: null, // Show immediately
        });
      } catch (demoError) {
        console.log('Demo notification also failed:', demoError.message);
      }
    }
  };

  // Toggle notifications
  const toggleNotifications = async () => {
    const newEnabled = !notificationsEnabled;
    setNotificationsEnabled(newEnabled);
    
    try {
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(newEnabled));
      
      if (newEnabled) {
        await scheduleTaskReminder();
        Alert.alert(
          'Notifications Enabled',
          'Daily reminders scheduled for 9:00 AM!\n\nNote: Full push notifications work in development builds. In Expo Go, you\'ll see demo notifications.',
          [{ text: 'Got it!', style: 'default' }]
        );
      } else {
        try {
          await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (cancelError) {
          console.log('Failed to cancel notifications (expected in Expo Go):', cancelError.message);
        }
        Alert.alert(
          'Notifications Disabled',
          'You won\'t receive reminders anymore.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Failed to toggle notifications:', error);
    }
  };

  // Send achievement notification
  const sendAchievementNotification = async (title, message) => {
    if (!notificationsEnabled) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          data: { type: 'achievement' },
        },
        trigger: null, // Show immediately
      });
      console.log('Achievement notification sent:', title);
    } catch (error) {
      console.log('Failed to send achievement notification (expected in Expo Go):', error.message);
      // Fall back to in-app alert in Expo Go
      Alert.alert(title, message, [{ text: 'Awesome!', style: 'default' }]);
    }
  };
  
  return (
    <>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#1a1a1a" : "#f5f5f5"} />
      {currentScreen === 'tasks' ? (
        <TasksContent 
          onSettingsPress={() => setCurrentScreen('settings')} 
          isDarkMode={isDarkMode} 
          notificationsEnabled={notificationsEnabled}
          onAchievement={sendAchievementNotification}
        />
      ) : (
        <SettingsContent 
          onBackPress={() => setCurrentScreen('tasks')} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode}
          notificationsEnabled={notificationsEnabled}
          toggleNotifications={toggleNotifications}
          pushToken={pushToken}
        />
      )}
    </>
  );
}

function TasksContent({ onSettingsPress, isDarkMode, notificationsEnabled, onAchievement }) {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState("all"); // 'all' | 'active' | 'done'

  // Load tasks from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (e) {
        console.error("Failed to load tasks:", e);
      }
    };

    loadData();
  }, []);

  // Save tasks and check for achievements
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
        
        // Check for achievement notifications
        if (notificationsEnabled) {
          checkAchievements();
        }
      } catch (e) {
        console.error("Failed to save tasks:", e);
      }
    };

    saveTasks();
  }, [tasks, notificationsEnabled]);

  const checkAchievements = () => {
    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    
    // Achievement: 10 tasks completed
    if (completedTasks.length === 10) {
      onAchievement(
        '🎉 Achievement Unlocked!',
        'You\'ve completed 10 tasks! Great job staying productive!'
      );
    }
    
    // Achievement: All tasks complete
    if (activeTasks.length === 0 && tasks.length > 0) {
      onAchievement(
        '✅ All Tasks Complete!',
        'Congratulations! You\'ve completed all your tasks.'
      );
    }
  };

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

function SettingsContent({ onBackPress, isDarkMode, setIsDarkMode, notificationsEnabled, toggleNotifications, pushToken }) {
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
          <Text style={[styles.settingLabel, isDarkMode && styles.darkSettingLabel]}>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Notification Info Section */}
      <View style={[styles.section, isDarkMode && styles.darkSection]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>Notification Info</Text>
        
        <View style={[styles.settingRow, isDarkMode && styles.darkSettingRow]}>
          <Text style={[styles.settingLabel, isDarkMode && styles.darkSettingLabel]}>Status</Text>
          <Text style={[styles.settingValue, isDarkMode && styles.darkSettingValue]}>
            {notificationsEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
        
        <View style={[styles.settingRow, isDarkMode && styles.darkSettingRow]}>
          <Text style={[styles.settingLabel, isDarkMode && styles.darkSettingLabel]}>Daily Reminder</Text>
          <Text style={[styles.settingValue, isDarkMode && styles.darkSettingValue]}>
            {notificationsEnabled ? '9:00 AM' : 'N/A'}
          </Text>
        </View>
        
        {pushToken && (
          <View style={[styles.settingRow, isDarkMode && styles.darkSettingRow]}>
            <Text style={[styles.settingLabel, isDarkMode && styles.darkSettingLabel]}>Push Token</Text>
            <Text style={[styles.settingValue, isDarkMode && styles.darkSettingValue, { fontSize: 10 }]}>
              {pushToken.substring(0, 20)}...
            </Text>
          </View>
        )}
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
