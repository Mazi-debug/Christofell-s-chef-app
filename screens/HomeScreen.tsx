/* Code Attribution
   Author: Christoffel Smith (Modified)
   Title: React Native Menu Management Screen
   Date Published: 2025
   Link/URL: https://github.com/christoffel-smith/menu-management
   Date Accessed: 2025-09-29
*/

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

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

interface HomeScreenProps {
  menuItems: MenuItem[];
  onAddPress: () => void;
  onFilterPress: () => void;
  onDeleteItem: (id: string) => void;
}

// -----------------------------
// Utility Functions
// -----------------------------

// Calculate average price using FOR loop (PoE requirement)
const calculateAveragePrice = (items: MenuItem[], course: string): number => {
  let total = 0;
  let count = 0;

  for (let i = 0; i < items.length; i++) {
    if (items[i].course === course) {
      total += items[i].price;
      count++;
    }
  }

  return count > 0 ? total / count : 0;
};

// Get unique courses using FOR...IN loop (PoE requirement)
const getUniqueCourses = (items: MenuItem[]): string[] => {
  const coursesSet = new Set<string>();

  for (const index in items) {
    coursesSet.add(items[index].course);
  }

  return Array.from(coursesSet);
};

// Calculate course statistics using WHILE loop (PoE requirement)
const calculateCourseStats = (items: MenuItem[]): { course: string; count: number; average: number }[] => {
  const uniqueCourses = getUniqueCourses(items);
  const stats: { course: string; count: number; average: number }[] = [];
  let i = 0;

  while (i < uniqueCourses.length) {
    const course = uniqueCourses[i];
    const average = calculateAveragePrice(items, course);
    const count = items.filter(item => item.course === course).length;

    stats.push({
      course,
      count,
      average,
    });

    i++;
  }

  return stats;
};

// -----------------------------
// HomeScreen Component
// -----------------------------

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  menuItems, 
  onAddPress, 
  onFilterPress,
  onDeleteItem 
}) => {
  const courseStats = calculateCourseStats(menuItems);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Dish',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDeleteItem(id) },
      ]
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuCard}>
      {item.image && (
        <Image 
          source={{ uri: item.image }} 
          style={styles.dishImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.cardContent}>
        <View style={styles.menuCardHeader}>
          <Text style={styles.dishName}>{item.name}</Text>
          <Text style={styles.courseTag}>{item.course}</Text>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id, item.name)}
          >
            <Text style={styles.deleteButtonText}>🗑 Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Christoffel's App</Text>
          <Text style={styles.headerSubtitle}>Menu Management</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{menuItems.length}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
        </View>

        {courseStats.length > 0 && (
          <View style={styles.averagePriceSection}>
            <Text style={styles.sectionTitle}>Average Prices by Course</Text>
            {courseStats.map((stat) => (
              <View key={stat.course} style={styles.averagePriceCard}>
                <View style={styles.averagePriceRow}>
                  <Text style={styles.courseName}>{stat.course}</Text>
                  <Text style={styles.courseCount}>({stat.count} items)</Text>
                </View>
                <Text style={styles.averagePrice}>R{stat.average.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addDishButton} onPress={onAddPress}>
            <Text style={styles.addDishButtonText}>+ Add New Dish</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
            <Text style={styles.filterButtonText}>🔍 Filter Menu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Current Menu</Text>

          {menuItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No dishes added yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Tap "Add New Dish" to create your first menu item
              </Text>
            </View>
          ) : (
            <FlatList
              data={menuItems}
              renderItem={renderMenuItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// -----------------------------
// Styles (FIXED COLOR CODES)
// -----------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ff0000',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFE5D9',
    marginTop: 5,
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fc1414',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  averagePriceSection: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  averagePriceCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  averagePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  courseCount: {
    fontSize: 12,
    color: '#999',
  },
  averagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000',
  },
  buttonContainer: {
    marginHorizontal: 15,
    gap: 10,
  },
  addDishButton: {
    backgroundColor: '#ff2525',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addDishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff0000',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterButtonText: {
    color: '#ff0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuSection: {
    margin: 15,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  dishImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 15,
  },
  menuCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  courseTag: {
    backgroundColor: '#FFE5D9',
    color: '#ff1d1d',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000',
  },
  deleteButton: {
    backgroundColor: '#ff0101',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default HomeScreen;