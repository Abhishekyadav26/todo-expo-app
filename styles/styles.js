import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Main container and layout
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 60, // Increased top padding for better visibility
    paddingBottom: 20, // Added bottom padding
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25, // Increased margin
    marginTop: 10, // Added top margin
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  darkTitle: {
    color: "#ffffff",
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  settingsIcon: {
    fontSize: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  backIcon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 36, // Same width as settings button for balance
  },

  // Task counter
  taskCount: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20, // Increased margin
    fontStyle: "italic",
  },

  // Filter tabs
  tabRow: {
    flexDirection: "row",
    marginBottom: 25, // Increased margin
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  tabTextActive: {
    color: "#fff",
  },

  // Input section
  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25, // Increased margin
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  addButton: {
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Task list
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#999",
    fontStyle: "italic",
  },

  // Task items
  taskRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12, // Increased margin between tasks
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  editButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  editButtonText: {
    fontSize: 16,
  },

  // Swipe actions
  deleteAction: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 12,
    marginBottom: 10,
  },
  deleteActionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // Footer links
  footerLinks: {
    marginTop: 30, // Increased margin
    paddingTop: 20,
    paddingBottom: 30, // Added bottom padding
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  link: {
    alignSelf: "center",
    padding: 12,
  },
  linkText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  // Settings screen styles
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
  },
  settingValue: {
    fontSize: 14,
    color: "#666",
  },

  // Dark mode styles
  darkSection: {
    backgroundColor: "#1e1e1e",
  },
  darkSectionTitle: {
    color: "#ffffff",
  },
  darkSettingRow: {
    borderBottomColor: "#333333",
  },
  darkSettingLabel: {
    color: "#ffffff",
  },
  darkSettingValue: {
    color: "#bbbbbb",
  },
  darkBackButton: {
    backgroundColor: "#333333",
  },
  darkBackIcon: {
    color: "#ffffff",
  },
  darkTaskCount: {
    color: "#bbbbbb",
  },
  darkTabRow: {
    backgroundColor: "#1e1e1e",
  },
  darkTab: {
    backgroundColor: "#333333",
  },
  darkTabActive: {
    backgroundColor: "#007AFF",
  },
  darkTabText: {
    color: "#bbbbbb",
  },
  darkInput: {
    backgroundColor: "#1e1e1e",
    borderColor: "#333333",
    color: "#ffffff",
  },
  darkTaskRow: {
    backgroundColor: "#1e1e1e",
  },
  darkTaskText: {
    color: "#ffffff",
  },
  darkTaskTextCompleted: {
    color: "#888888",
  },
  darkEmptyText: {
    color: "#888888",
  },
  darkFooterLinks: {
    borderTopColor: "#333333",
  },
  darkLinkText: {
    color: "#007AFF",
  },
  darkModalSheet: {
    backgroundColor: "#1e1e1e",
  },
  darkModalTitle: {
    color: "#ffffff",
  },
  darkModalInput: {
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
  },
  darkCancelButton: {
    backgroundColor: "#333333",
  },
  darkCancelButtonText: {
    color: "#ffffff",
  },
});
