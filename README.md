# TodoApp - React Native Todo Application


https://github.com/user-attachments/assets/57f3aea8-5b0a-4f19-9823-c54c84f1c547


A feature-rich mobile todo application built with React Native and Expo, designed to help users manage their daily tasks efficiently.

## Features

- **Add Tasks**: Create new todo items with ease
- **Edit Tasks**: Modify task descriptions after creation
- **Delete Tasks**: Remove tasks with a simple swipe gesture
- **Mark as Complete**: Toggle task completion status
- **Filter Tasks**: View all tasks, active tasks, or completed tasks
- **Persistent Storage**: Tasks are automatically saved and restored using AsyncStorage
- **Responsive UI**: Works seamlessly on Android, iOS, and Web platforms
- **Gesture Support**: Swipe to delete functionality with smooth animations

## Tech Stack

- **Framework**: React Native 0.81.5
- **Development Platform**: Expo ~54.0.33
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: AsyncStorage for persistent data
- **Gestures**: React Native Gesture Handler
- **Navigation**: Expo Router
- **UI Components**: React Native core components

## Project Structure

```
TodoApp/
├── App.js              # Main application component
├── app.json            # Expo configuration
├── index.js            # Entry point
├── package.json        # Project dependencies
├── README.md           # This file
└── assets/             # Application assets
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TodoApp
```

2. Install dependencies:
```bash
npm install
```

### Running the App

Start the development server:
```bash
npm start
```

Then choose your platform:

- **Android**: Press `a` or run `npm run android`
- **iOS**: Press `i` or run `npm run ios`
- **Web**: Press `w` or run `npm run web`

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Launch the app on Android emulator/device
- `npm run ios` - Launch the app on iOS simulator/device
- `npm run web` - Open the app in a web browser

## Usage

1. **Add a Task**: Type in the input field and press the "Add" button
2. **Mark as Complete**: Tap on a task to toggle its completion status
3. **Edit a Task**: Press the edit icon on the task to modify it
4. **Delete a Task**: Swipe left on a task to delete it
5. **Filter Tasks**: Use the filter buttons (All, Active, Done) to view specific tasks

## Key Components

### Main App Component
The `App.js` file contains:
- Task state management
- Input handling for adding new tasks
- Edit modal functionality
- Filter logic for displaying tasks
- AsyncStorage integration for persistence
- Gesture handling for swipe-to-delete

## Dependencies

- `@react-native-async-storage/async-storage` - Local storage for task persistence
- `expo` - Development platform and build tools
- `react-native-gesture-handler` - Gesture recognition and handling
- `expo-router` - Routing and navigation
- `expo-constants` - Access to app configuration
- `expo-linking` - Deep linking support

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is private and not publicly licensed.

## Author

Abhishekyadav26

## Troubleshooting

- **Tasks not persisting**: Ensure AsyncStorage is properly configured
- **Gesture handler issues**: Run `npm install` to ensure all dependencies are installed
- **Expo errors**: Clear cache with `expo start --clear` and retry

## Future Enhancements

- Task categories/labels
- Due dates and reminders
- Task priority levels
- Cloud synchronization
- Dark mode support
- Task search functionality
