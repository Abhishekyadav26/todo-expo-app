import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert, StatusBar } from 'react-native';
import { useRouter, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import styles from '../styles/styles';

export default function SettingsScreen() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <SettingsContent />
    </>
  );
}

function SettingsContent() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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
              router.back();
            } catch (error) {
              console.error('Failed to clear tasks:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        
        <TouchableOpacity style={styles.settingRow} onPress={clearAllTasks}>
          <Text style={[styles.settingLabel, { color: '#ff3b30' }]}>
            Clear All Tasks
          </Text>
          <Text style={styles.settingValue}>Delete all data</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Developer</Text>
          <Text style={styles.settingValue}>TodoApp Team</Text>
        </View>
      </View>

      {/* Navigation Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation Examples</Text>
        
        <Link href="/" style={styles.settingRow}>
          <Text style={styles.settingLabel}>Back to Tasks</Text>
          <Text style={styles.settingValue}>Home</Text>
        </Link>
        
        <TouchableOpacity 
          style={styles.settingRow} 
          onPress={() => router.back()}
        >
          <Text style={styles.settingLabel}>Go Back</Text>
          <Text style={styles.settingValue}>Previous screen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
