/* Code Attribution
   Author: Olivia Bennett (Modified)
   Title: React Native Multi-Screen Menu Management App
   Date Published: 2025
   Link/URL: https://github.com/oliviabennettdev/react-native-menu-manager
   Date Accessed: 2025-09-29
*/

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

// Import custom screen components
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import AddDishScreen from './screens/AddDishScreen';
import FilterScreen from './screens/FilterScreen';

// -----------------------------
// Type Definitions
// -----------------------------

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
  image?: string;
}

type Screen = 'splash' | 'home' | 'addDish' | 'filter';

// -----------------------------
// Sample Data
// -----------------------------

const INITIAL_DISHES: MenuItem[] = [
  {
    id: '2',
    name: 'Full English Breakfast',
    description: 'Classic Full English breakfast with eggs, bacon, sausages, and beans',
    course: 'Breakfast',
    price: 85.00,
    image: 'https://plus.unsplash.com/premium_photo-1663840225558-03ac41c68873?w=800&auto=format&fit=crop&q=60',
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

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_DISHES);

  // -----------------------------
  // Navigation and Actions
  // -----------------------------

  const handleSplashFinish = () => {
    setCurrentScreen('home');
  };

  const navigateToAddDish = () => {
    setCurrentScreen('addDish');
  };

  const navigateToFilter = () => {
    setCurrentScreen('filter');
  };

  const navigateToHome = () => {
    setCurrentScreen('home');
  };

  const addMenuItem = (
    name: string,
    description: string,
    course: string,
    price: number,
    imageUrl?: string
  ) => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name,
      description,
      course,
      price,
      image: imageUrl,
    };
    setMenuItems([...menuItems, newItem]);
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  // -----------------------------
  // Screen Rendering Logic
  // -----------------------------

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;

      case 'home':
        return (
          <HomeScreen
            menuItems={menuItems}
            onAddPress={navigateToAddDish}
            onFilterPress={navigateToFilter}
            onDeleteItem={deleteMenuItem}
          />
        );

      case 'addDish':
        return (
          <AddDishScreen
            onAddDish={addMenuItem}
            onCancel={navigateToHome}
          />
        );

      case 'filter':
        return (
          <FilterScreen
            menuItems={menuItems}
            onBack={navigateToHome}
            onDeleteItem={deleteMenuItem}
          />
        );

      default:
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

  return <View style={styles.container}>{renderScreen()}</View>;
};

// -----------------------------
// Styles
// -----------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;