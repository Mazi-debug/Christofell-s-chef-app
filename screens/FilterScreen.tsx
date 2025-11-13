/* Code Attribution
   Author: Student Name
   Title: React Native Filter Screen Component
   Date Published: 2025
   Link/URL: Custom Implementation
   Date Accessed: 2025-10-29
*/

import React, { useState } from 'react';
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

interface FilterScreenProps {
  menuItems: MenuItem[];
  onBack: () => void;
  onDeleteItem: (id: string) => void;
}

const COURSES = ['All', 'Breakfast', 'Lunch', 'Dinner'];

// -----------------------------
// Utility Functions
// -----------------------------

function filterMenuItems(items: MenuItem[], selectedCourse: string): MenuItem[] {
  if (selectedCourse === 'All') {
    return items;
  }

  const filteredItems: MenuItem[] = [];
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].course === selectedCourse) {
      filteredItems.push(items[i]);
    }
  }

  return filteredItems;
}

function countItemsInCourse(items: MenuItem[], course: string): number {
  let count = 0;
  let i = 0;

  while (i < items.length) {
    if (items[i].course === course) {
      count++;
    }
    i++;
  }

  return count;
}

// -----------------------------
// FilterScreen Component
// -----------------------------

const FilterScreen: React.FC<FilterScreenProps> = ({ menuItems, onBack, onDeleteItem }) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('All');

  const filteredItems = filterMenuItems(menuItems, selectedCourse);

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

  const renderCourseButton = (course: string) => {
    const isSelected = selectedCourse === course;
    const itemCount = course === 'All' ? menuItems.length : countItemsInCourse(menuItems, course);

    return (
      <TouchableOpacity
        key={course}
        style={[
          styles.courseButton,
          isSelected && styles.courseButtonSelected,
        ]}
        onPress={() => setSelectedCourse(course)}
      >
        <Text style={[
          styles.courseButtonText,
          isSelected && styles.courseButtonTextSelected,
        ]}>
          {course}
        </Text>
        <Text style={[
          styles.courseCount,
          isSelected && styles.courseCountSelected,
        ]}>
          {itemCount}
        </Text>
      </TouchableOpacity>
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
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filter Menu</Text>
          <Text style={styles.headerSubtitle}>Select a course to view</Text>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filter by Course:</Text>
          <View style={styles.courseButtonContainer}>
            {COURSES.map((course) => renderCourseButton(course))}
          </View>
        </View>

        <View style={styles.resultsSection}>
          <Text style={styles.resultsText}>
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            {selectedCourse !== 'All' && ` in ${selectedCourse}`}
          </Text>
        </View>

        <View style={styles.menuSection}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No dishes found</Text>
              <Text style={styles.emptyStateSubtext}>
                {selectedCourse === 'All' 
                  ? 'No menu items have been added yet'
                  : `No dishes in ${selectedCourse} course`}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
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
  backButton: {
    position: 'absolute',
    left: 15,
    top: 50,
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  filterSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  courseButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  courseButton: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  courseButtonSelected: {
    backgroundColor: '#ff0000',
    borderColor: '#ff0000',
  },
  courseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  courseButtonTextSelected: {
    color: '#fff',
  },
  courseCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
  },
  courseCountSelected: {
    color: '#FFE5D9',
  },
  resultsSection: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  menuSection: {
    margin: 15,
    marginBottom: 30,
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

export default FilterScreen;