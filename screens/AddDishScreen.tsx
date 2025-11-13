/* Code Attribution
   Author: Bootstrap Team (Modified)
   Title: Bootstrap v5 Accessibility Helpers
   Date Published: 2024
   Link/URL: https://getbootstrap.com/docs/5.0/helpers/screen-readers/
   Date Accessed: 2025-09-29
*/

// Import React and necessary hooks for state management
import React, { useState } from 'react';

// Import core React Native components for building the UI
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

// Import Picker component for course selection dropdown
import { Picker } from '@react-native-picker/picker';

// Define a constant array of available meal courses for the dish
export const COURSES = ['Breakfast', 'Lunch', 'Dinner'];

// Define the props interface for the AddDishScreen component
// This ensures type safety for the incoming props: callback for adding dish and canceling
interface AddDishScreenProps {
  onAddDish: (name: string, description: string, course: string, price: number, imageUrl?: string) => void;
  onCancel: () => void;
}

// Main functional component for adding a new dish to the menu
// Accepts props for handling dish addition and cancellation
const AddDishScreen: React.FC<AddDishScreenProps> = ({ onAddDish, onCancel }) => {
  // Local state for dish name input
  const [dishName, setDishName] = useState('');
  // Local state for dish description input
  const [description, setDescription] = useState('');
  // Local state for selected course (defaults to first option)
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  // Local state for price input (stored as string for TextInput)
  const [price, setPrice] = useState('');
  // Local state for optional image URL input
  const [imageUrl, setImageUrl] = useState('');

  // Handler function for adding the dish
  // Validates inputs, calls onAddDish prop, resets form, and shows success alert
  const handleAddDish = () => {
    // Validate that dish name is not empty after trimming whitespace
    if (!dishName.trim()) {
      Alert.alert('Error', 'Please enter a dish name');
      return;
    }
    // Validate that description is not empty after trimming whitespace
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    // Validate price: not empty, valid number, and greater than 0
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    // Call the parent callback to add the dish with parsed values
    // Image URL is optional: if empty after trim, pass undefined
    onAddDish(dishName, description, selectedCourse, parseFloat(price), imageUrl.trim() || undefined);

    // Reset all form fields to initial empty/default states
    setDishName('');
    setDescription('');
    setSelectedCourse(COURSES[0]);
    setPrice('');
    setImageUrl('');

    // Show success alert with OK button that triggers cancel (closes screen)
    Alert.alert('Success', 'Dish added to menu!', [
      { text: 'OK', onPress: onCancel }
    ]);
  };

  // Render the main UI: KeyboardAvoidingView wraps everything for proper keyboard handling
  return (
    <KeyboardAvoidingView
      // Full-screen container with light gray background
      style={styles.container}
      // Adjust padding/height based on platform (iOS vs Android) to avoid keyboard overlap
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ScrollView allows scrolling if content exceeds screen height */}
      <ScrollView style={styles.scrollView}>
        {/* Header section with title and subtitle */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add New Dish</Text>
          <Text style={styles.headerSubtitle}>Fill in the details below</Text>
        </View>

        {/* Main form section with all input fields */}
        <View style={styles.formSection}>
          {/* Label for required dish name field */}
          <Text style={styles.label}>Dish Name *</Text>
          {/* TextInput for dish name with placeholder and state binding */}
          <TextInput
            style={styles.input}
            placeholder="Enter dish name"
            value={dishName}
            onChangeText={setDishName}
            placeholderTextColor="#999"
          />

          {/* Label for required description field */}
          <Text style={styles.label}>Description *</Text>
          {/* Multiline TextInput for description (acts like a textarea) */}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            placeholderTextColor="#999"
          />

          {/* Label for required course selection */}
          <Text style={styles.label}>Course *</Text>
          {/* Wrapper view for Picker to apply custom styling */}
          <View style={styles.pickerWrapper}>
            {/* Picker component for selecting meal course */}
            <Picker
              selectedValue={selectedCourse}
              onValueChange={(itemValue) => setSelectedCourse(itemValue)}
              style={styles.picker}
            >
              {/* Map over COURSES array to render Picker.Item options */}
              {COURSES.map((course) => (
                <Picker.Item key={course} label={course} value={course} />
              ))}
            </Picker>
          </View>

          {/* Label for required price field (in Rand currency) */}
          <Text style={styles.label}>Price (R) *</Text>
          {/* TextInput for price with numeric decimal keyboard */}
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />

          {/* Label for optional image URL field */}
          <Text style={styles.label}>Image URL (Optional)</Text>
          {/* TextInput for image URL with URL keyboard and no auto-capitalize */}
          <TextInput
            style={styles.input}
            placeholder="Paste image URL here"
            value={imageUrl}
            onChangeText={setImageUrl}
            keyboardType="url"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />

          {/* TouchableOpacity button to trigger add action */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddDish}>
            <Text style={styles.addButtonText}>Add Dish</Text>
          </TouchableOpacity>

          {/* TouchableOpacity button to cancel and close the screen */}
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Define reusable styles object using StyleSheet.create for performance optimization
const styles = StyleSheet.create({
  // Full-screen container with flex and background color
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // ScrollView takes full available space
  scrollView: {
    flex: 1,
  },
  // Header with red background, padding, and centered content
  header: {
    backgroundColor: '#ff0000',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  // Bold white title for header
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Subtle subtitle in light color
  headerSubtitle: {
    fontSize: 14,
    color: '#FFE5D9',
    marginTop: 5,
  },
  // Form section with white background, margins, padding, and subtle shadow/elevation
  formSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // Standard label style: semi-bold, dark color, with vertical margins
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  // Base input style: bordered, rounded, padded, light background
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  // Additional styles for multiline text area (height and vertical alignment)
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  // Wrapper for picker to mimic input styling (border, background)
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  // Picker height to match input fields
  picker: {
    height: 50,
  },
  // Primary add button: red background, elevated, centered text
  addButton: {
    backgroundColor: '#ff0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  // White bold text for add button
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Secondary cancel button: white background with border
  cancelButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  // Gray bold text for cancel button
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Export the component as default for use in other files
export default AddDishScreen;