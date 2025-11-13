/* Code Attribution
   Author: Olivia Bennett (Modified)
   Title: React Native Multi-Screen Menu Management App
   Date Published: 2025
   Link/URL: https://github.com/oliviabennettdev/react-native-menu-manager
   Date Accessed: 2025-09-29
*/

// Import React with useState hook for managing component state
import React, { useState } from 'react';

// Import core React Native components for layout and styling
import { View, StyleSheet } from 'react-native';

// Import custom screen components for the app's different views
import SplashScreen from './screens/SplashScreen';  // Initial loading screen with animation
import HomeScreen from './screens/HomeScreen';     // Main menu display and management screen
import AddDishScreen from './screens/AddDishScreen';  // Screen for adding new menu items
import FilterScreen from './screens/FilterScreen';    // Screen for filtering and viewing menu items

// -----------------------------
// Type Definitions
// -----------------------------

// Define the interface for a single menu item object
// Used across screens for type safety in props and state
export interface MenuItem {
  id: string;       // Unique identifier for the item
  name: string;     // Name of the dish
  description: string;  // Detailed description of the dish
  course: string;   // Meal course (e.g., Breakfast, Lunch, Dinner)
  price: number;    // Price of the dish in Rand
  image?: string;   // Optional URL for dish image
}

// Define a union type for the possible screen states
// Used to manage navigation between different app views
type Screen = 'splash' | 'home' | 'addDish' | 'filter';

// -----------------------------
// Sample Data
// -----------------------------

// Initialize the app with sample menu items for demonstration
// This array populates the menu on first load
const INITIAL_DISHES: MenuItem[] = [
  {
    id: '2',  // Unique ID for the item
    name: 'Full English Breakfast',
    description: 'Classic Full English breakfast with eggs, bacon, sausages, and beans',
    course: 'Breakfast',  // Assigned to Breakfast course
    price: 85.00,  // Price in Rand
    image: 'https://plus.unsplash.com/premium_photo-1663840225558-03ac41c68873?w=800&auto=format&fit=crop&q=60',  // Unsplash image URL
  },
  {
    id: '1',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan, croutons and Caesar dressing',
    course: 'Lunch',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1670237735381-ac5c7fa72c51?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    name: 'Beef Steak',
    description: 'Prime ribeye steak with garlic butter and roasted vegetables',
    course: 'Dinner',
    price: 225.00,
    image: 'https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=800&auto=format&fit=crop&q=60',
  },
];

// -----------------------------
// Main App Component
// -----------------------------

// Primary App component: root of the application
// Manages global state for menu items and current screen, handles navigation and CRUD operations
const App: React.FC = () => {
  // Local state for the current active screen (defaults to splash)
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  // Local state for the array of menu items (initialized with sample data)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_DISHES);

  // -----------------------------
  // Navigation and Actions
  // -----------------------------

  // Handler called when splash screen animation completes
  // Transitions the app to the home screen
  const handleSplashFinish = () => {
    setCurrentScreen('home');
  };

  // Navigate to the Add Dish screen from home
  const navigateToAddDish = () => {
    setCurrentScreen('addDish');
  };

  // Navigate to the Filter screen from home
  const navigateToFilter = () => {
    setCurrentScreen('filter');
  };

  // Navigate back to the Home screen from other screens
  const navigateToHome = () => {
    setCurrentScreen('home');
  };

  // Handler to add a new menu item to the state
  // Creates a new item object with a timestamp-based ID and appends to the array
  const addMenuItem = (
    name: string,
    description: string,
    course: string,
    price: number,
    imageUrl?: string  // Optional image URL
  ) => {
    const newItem: MenuItem = {
      id: Date.now().toString(),  // Generate unique ID using current timestamp
      name,
      description,
      course,
      price,
      image: imageUrl,  // Assign optional image
    };
    // Update state by creating a new array with the added item (immutable update)
    setMenuItems([...menuItems, newItem]);
  };

  // Handler to delete a menu item by ID
  // Filters out the matching item from the array
  const deleteMenuItem = (id: string) => {
    // Immutable update: create new array excluding the item with matching ID
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  // -----------------------------
  // Screen Rendering Logic
  // -----------------------------

  // Helper function to render the appropriate screen based on currentScreen state
  // Uses a switch statement for clean conditional rendering
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        // Render splash screen with callback to finish and go to home
        return <SplashScreen onFinish={handleSplashFinish} />;

      case 'home':
        // Render home screen, passing menu items and navigation/deletion callbacks
        return (
          <HomeScreen
            menuItems={menuItems}
            onAddPress={navigateToAddDish}
            onFilterPress={navigateToFilter}
            onDeleteItem={deleteMenuItem}
          />
        );

      case 'addDish':
        // Render add dish screen, passing add and cancel (back to home) callbacks
        return (
          <AddDishScreen
            onAddDish={addMenuItem}
            onCancel={navigateToHome}
          />
        );

      case 'filter':
        // Render filter screen, passing menu items and back/deletion callbacks
        return (
          <FilterScreen
            menuItems={menuItems}
            onBack={navigateToHome}
            onDeleteItem={deleteMenuItem}
          />
        );

      default:
        // Fallback to home screen if invalid screen state
        return (
          <HomeScreen
            menuItems={menuItems}
            onAddPress={navigateToAddDish}
            onFilterPress={navigateToFilter}
            onDeleteItem={deleteMenuItem}
          />
        );
    }
  };

  // Main render: Wrap the rendered screen in a full-screen View container
  return <View style={styles.container}>{renderScreen()}</View>;
};

// -----------------------------
// Styles
// -----------------------------

// Define reusable styles object using StyleSheet.create for performance optimization
const styles = StyleSheet.create({
  // Full-screen flex container (no additional styling needed)
  container: {
    flex: 1,
  },
});

// Export the App component as default for use as the entry point in index.js
export default App;