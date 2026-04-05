# Push Notifications Setup

## Current Status
✅ **Basic notifications implemented** - Works in development builds
⚠️ **Expo Go limitations** - Limited functionality in Expo Go

## What Works Now

### In Expo Go (Current Setup):
- ✅ **Demo notifications** - Shows immediate notifications
- ✅ **Achievement alerts** - Falls back to in-app alerts
- ✅ **Settings toggle** - Enable/disable notifications
- ✅ **Permission handling** - Requests notification access

### In Development Build (Full Features):
- ✅ **Daily reminders** - 9:00 AM scheduled notifications
- ✅ **Push notifications** - Real device notifications
- ✅ **Background support** - Works when app is closed
- ✅ **Sound & badges** - Full notification experience

## How to Get Full Push Notifications

### Option 1: Development Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for your device
eas build --platform android
# or
eas build --platform ios
```

### Option 2: Get Project ID
1. Go to [Expo Dashboard](https://expo.dev)
2. Create a new project or use existing one
3. Copy the Project ID
4. Update `app.json`:
```json
"plugins": [
  "expo-router",
  [
    "expo-notifications",
    {
      "projectId": "your-actual-project-id-here"
    }
  ]
]
```

## Testing Notifications

### In Expo Go:
1. Enable notifications in settings
2. Complete 10 tasks → See achievement alert
3. Complete all tasks → See completion alert
4. Toggle notifications → See demo notification

### In Development Build:
1. Build and install the app
2. Enable notifications in settings
3. Wait for 9:00 AM → Get daily reminder
4. Complete tasks → Get achievement notifications

## Features

### 🎯 Achievement Notifications:
- **10 Tasks Milestone**: "🎉 Achievement Unlocked!"
- **All Tasks Complete**: "✅ All Tasks Complete!"

### 📅 Daily Reminders:
- **Time**: 9:00 AM every day
- **Message**: "Time to check your tasks and stay productive!"
- **Repeat**: Daily

### ⚙️ Settings:
- **Toggle**: Enable/disable notifications
- **Status**: Shows current state
- **Push Token**: Device identifier (for development)

## Troubleshooting

### "No projectId found" Error:
- Update `app.json` with your actual project ID from Expo Dashboard
- Or use a development build (projectId not required for local testing)

### "Push token not available" Warning:
- Normal in Expo Go - push tokens only work in development builds
- App will still show demo notifications

### "shouldShowAlert is deprecated" Warning:
- Fixed - using new `shouldShowBanner` API
- App will work normally

## Future Enhancements

### Possible Additions:
- 🕐 **Custom reminder times**
- 📊 **Task completion summaries**
- ⏰ **Deadline notifications**
- 🏆 **Streak tracking**
- 🔔 **Different notification sounds

### Advanced Features:
- 📱 **Remote push notifications** via backend
- 🎯 **Personalized notification content**
- 📈 **Analytics integration**
- 🔄 **Sync across devices**

## Code Structure

### Key Files:
- `app/index.jsx` - Main notification logic
- `app.json` - Expo configuration
- `styles/styles.js` - UI styling

### Key Functions:
- `initializeNotifications()` - Setup and permissions
- `scheduleTaskReminder()` - Daily 9 AM reminder
- `sendAchievementNotification()` - Achievement alerts
- `toggleNotifications()` - Settings toggle

## Support

For issues with expo-notifications:
- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Forums](https://forums.expo.dev/)
- [GitHub Issues](https://github.com/expo/expo-notifications/issues)
