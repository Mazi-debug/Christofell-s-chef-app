/* Code Attribution
   Author: Christoffel Smith (Modified)
   Title: React Native Menu Management Screen
   Date Published: 2025
   Link/URL: https://github.com/christoffel-smith/menu-management
   Date Accessed: 2025-09-29
*/

// Import React for building the component
import React from 'react';

// Import core React Native components for UI rendering, lists, scrolling, interactions, and alerts
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

// Define the interface for a single menu item object
// Includes required fields like id, name, etc., and optional image
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
  image?: string;
}

// Define the props interface for the HomeScreen component
// Expects menuItems array and callbacks for adding, filtering, and deleting items
interface HomeScreenProps {
  menuItems: MenuItem[];
  onAddPress: () => void;
  onFilterPress: () => void;
  onDeleteItem: (id: string) => void;
}

// -----------------------------
// Utility Functions
// -----------------------------

// Calculate the average price for items in a specific course using a FOR loop (PoE requirement)
// Iterates through all items, sums prices for matches, and divides by count
const calculateAveragePrice = (items: MenuItem[], course: string): number => {
  let total = 0;  // Initialize sum of prices
  let count = 0;  // Initialize count of matching items

  // FOR loop to iterate through the items array
  for (let i = 0; i < items.length; i++) {
    if (items[i].course === course) {
      total += items[i].price;  // Add price to total if course matches
      count++;  // Increment count for matching item
    }
  }

  // Return average if count > 0, otherwise return 0 to avoid division by zero
  return count > 0 ? total / count : 0;
};

// Get unique courses from the menu items using a FOR...IN loop (PoE requirement)
// Uses a Set to avoid duplicates, then converts to array
const getUniqueCourses = (items: MenuItem[]): string[] => {
  const coursesSet = new Set<string>();  // Initialize Set for unique courses

  // FOR...IN loop to iterate over array indices
  for (const index in items) {
    coursesSet.add(items[index].course);  // Add course to Set (duplicates ignored)
  }

  // Convert Set back to array and return
  return Array.from(coursesSet);
};

// Calculate statistics (count and average price) for each unique course using a WHILE loop (PoE requirement)
// Relies on getUniqueCourses and calculateAveragePrice for data
const calculateCourseStats = (items: MenuItem[]): { course: string; count: number; average: number }[] => {
  const uniqueCourses = getUniqueCourses(items);  // Get list of unique courses
  const stats: { course: string; count: number; average: number }[] = [];  // Initialize stats array
  let i = 0;  // Initialize loop index

  // WHILE loop to iterate through unique courses
  while (i < uniqueCourses.length) {
    const course = uniqueCourses[i];  // Get current course
    const average = calculateAveragePrice(items, course);  // Calculate average for course
    const count = items.filter(item => item.course === course).length;  // Count items in course using filter

    // Push stat object to array
    stats.push({
      course,
      count,
      average,
    });

    i++;  // Increment index
  }

  return stats;
};

// -----------------------------
// HomeScreen Component
// -----------------------------

// Main functional component for the home screen of the menu management app
// Displays menu items, stats, and action buttons
const HomeScreen: React.FC<HomeScreenProps> = ({ 
  menuItems,   // Array of all menu items
  onAddPress,  // Callback to navigate to add dish screen
  onFilterPress,  // Callback to navigate to filter screen
  onDeleteItem  // Callback to delete a specific item by ID
}) => {
  // Compute course statistics once on render (recomputes if menuItems change)
  const courseStats = calculateCourseStats(menuItems);

  // Handler for confirming deletion of a menu item
  // Shows a confirmation alert before calling the onDeleteItem prop
  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Dish',  // Alert title
      `Are you sure you want to delete "${name}"?`,  // Alert message with item name
      [
        { text: 'Cancel', style: 'cancel' },  // Cancel option
        { text: 'Delete', style: 'destructive', onPress: () => onDeleteItem(id) },  // Delete option with callback
      ]
    );
  };

  // Render function for each menu item in the FlatList
  // Displays card with image (if available), details, price, and delete button
  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuCard}>
      {/* Conditionally render image if URL is provided */}
      {item.image && (
        <Image 
          source={{ uri: item.image }}  // Load image from URI
          style={styles.dishImage}
          resizeMode="cover"  // Scale image to cover container
        />
      )}

      {/* Main content area of the card */}
      <View style={styles.cardContent}>
        {/* Header row with name and course tag */}
        <View style={styles.menuCardHeader}>
          <Text style={styles.dishName}>{item.name}</Text>
          <Text style={styles.courseTag}>{item.course}</Text>
        </View>

        {/* Description text */}
        <Text style={styles.description}>{item.description}</Text>

        {/* Footer row with price and delete button */}
        <View style={styles.cardFooter}>
          <Text style={styles.price}>R{item.price.toFixed(2)}</Text>  {/* Format price to 2 decimal places */}
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id, item.name)}  // Trigger delete handler
          >
            <Text style={styles.deleteButtonText}>🗑 Delete</Text>  {/* Emoji icon for delete */}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Main render: Full-screen view with scrollable content
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header section with app title and subtitle */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Christoffel's App</Text>
          <Text style={styles.headerSubtitle}>Menu Management</Text>
        </View>

        {/* Stats card showing total number of menu items */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{menuItems.length}</Text>  {/* Dynamic total count */}
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
        </View>

        {/* Conditional section for average prices by course (only if stats exist) */}
        {courseStats.length > 0 && (
          <View style={styles.averagePriceSection}>
            <Text style={styles.sectionTitle}>Average Prices by Course</Text>
            {/* Map over stats to render cards for each course */}
            {courseStats.map((stat) => (
              <View key={stat.course} style={styles.averagePriceCard}>
                <View style={styles.averagePriceRow}>
                  <Text style={styles.courseName}>{stat.course}</Text>
                  <Text style={styles.courseCount}>({stat.count} items)</Text>  {/* Dynamic count */}
                </View>
                <Text style={styles.averagePrice}>R{stat.average.toFixed(2)}</Text>  {/* Formatted average */}
              </View>
            ))}
          </View>
        )}

        {/* Container for action buttons: add and filter */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addDishButton} onPress={onAddPress}>
            <Text style={styles.addDishButtonText}>+ Add New Dish</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
            <Text style={styles.filterButtonText}>🔍 Filter Menu</Text>
          </TouchableOpacity>
        </View>

        {/* Menu items display section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Current Menu</Text>

          {/* Conditional rendering: empty state or FlatList */}
          {menuItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No dishes added yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Tap "Add New Dish" to create your first menu item
              </Text>
            </View>
          ) : (
            <FlatList
              data={menuItems}  // Data source: all menu items
              renderItem={renderMenuItem}  // Item renderer
              keyExtractor={(item) => item.id}  // Unique key extractor
              scrollEnabled={false}  // Disable internal scrolling (parent ScrollView handles it)
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

// Define reusable styles object using StyleSheet.create for performance optimization
const styles = StyleSheet.create({
  // Full-screen container with flex and light gray background
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
  // Large bold white title for header
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Subtle light-colored subtitle
  headerSubtitle: {
    fontSize: 16,
    color: '#FFE5D9',
    marginTop: 5,
  },
  // Stats card: white, centered row layout, rounded, shadowed
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
  // Centered alignment for stat item
  statItem: {
    alignItems: 'center',
  },
  // Large bold red number for stat value
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fc1414',
  },
  // Small gray label for stat
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  // Margins for average price section
  averagePriceSection: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  // Individual average price card: white, row layout, lightly shadowed
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
  // Row for course name and count
  averagePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Semi-bold dark course name
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  // Small light gray count text
  courseCount: {
    fontSize: 12,
    color: '#999',
  },
  // Bold red average price text
  averagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000',
  },
  // Container for buttons with horizontal margins and gap
  buttonContainer: {
    marginHorizontal: 15,
    gap: 10,
  },
  // Primary add button: red background, elevated, centered
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
  // White bold text for add button
  addDishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Secondary filter button: white background with red border, lightly elevated
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
  // Bold red text for filter button
  filterButtonText: {
    color: '#ff0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Margins for menu section with bottom padding
  menuSection: {
    margin: 15,
    marginBottom: 30,
  },
  // Bold dark section title
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  // Card style for menu items: white, rounded, shadowed, no overflow clipping
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
  // Full-width image container with fixed height
  dishImage: {
    width: '100%',
    height: 200,
  },
  // Padding for card content
  cardContent: {
    padding: 15,
  },
  // Header row: space-between layout for name and tag
  menuCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  // Bold dark name text, flexible width
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  // Peach background tag for course with red text
  courseTag: {
    backgroundColor: '#FFE5D9',
    color: '#ff1d1d',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  // Description: gray, line-height for readability
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  // Footer row: space-between for price and button
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Bold red price text
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000',
  },
  // Small red rounded button for delete
  deleteButton: {
    backgroundColor: '#ff0101',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  // White bold small text for delete button
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Empty state card: white, centered, lightly shadowed
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
  // Medium gray bold empty state title
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  // Light gray centered subtext
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});

// Export the component as default for use in other files
export default HomeScreen;