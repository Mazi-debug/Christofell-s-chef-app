/* Code Attribution
   Author: Student Name
   Title: React Native Filter Screen Component
   Date Published: 2025
   Link/URL: Custom Implementation
   Date Accessed: 2025-10-29
*/

// Import React and necessary hooks for state management
import React, { useState } from 'react';

// Import core React Native components for building the UI, including list rendering and interactions
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

// Define the props interface for the FilterScreen component
// Expects menuItems array, callback for going back, and callback for deleting an item
interface FilterScreenProps {
  menuItems: MenuItem[];
  onBack: () => void;
  onDeleteItem: (id: string) => void;
}

// Define a constant array of available courses for filtering (includes 'All' option)
const COURSES = ['All', 'Breakfast', 'Lunch', 'Dinner'];

// -----------------------------
// Utility Functions
// -----------------------------

// Function to filter menu items based on the selected course
// Returns all items if 'All' is selected; otherwise, filters by matching course
function filterMenuItems(items: MenuItem[], selectedCourse: string): MenuItem[] {
  // If 'All' is selected, return the entire array without filtering
  if (selectedCourse === 'All') {
    return items;
  }

  // Initialize an empty array to store filtered results
  const filteredItems: MenuItem[] = [];
  
  // Iterate through items using a for loop and check for course match
  for (let i = 0; i < items.length; i++) {
    if (items[i].course === selectedCourse) {
      filteredItems.push(items[i]);
    }
  }

  return filteredItems;
}

// Function to count the number of items in a specific course
// Uses a while loop to iterate and increment count on matches
function countItemsInCourse(items: MenuItem[], course: string): number {
  let count = 0;  // Initialize counter
  let i = 0;      // Initialize loop index

  // Loop through items until end of array
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

// Main functional component for displaying and filtering menu items
// Accepts props for menu data and action callbacks
const FilterScreen: React.FC<FilterScreenProps> = ({ menuItems, onBack, onDeleteItem }) => {
  // Local state to track the currently selected course for filtering (defaults to 'All')
  const [selectedCourse, setSelectedCourse] = useState<string>('All');

  // Compute filtered list of items based on current selection (runs on every render)
  const filteredItems = filterMenuItems(menuItems, selectedCourse);

  // Handler for confirming deletion of a menu item
  // Shows a confirmation alert before calling the onDeleteItem prop
  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Dish',  // Alert title
      `Are you sure you want to delete "${name}"?`,  // Alert message
      [
        { text: 'Cancel', style: 'cancel' },  // Cancel option
        { text: 'Delete', style: 'destructive', onPress: () => onDeleteItem(id) },  // Delete option with callback
      ]
    );
  };

  // Helper function to render a single course filter button
  // Includes dynamic styling based on selection and displays item count
  const renderCourseButton = (course: string) => {
    // Check if this course is currently selected
    const isSelected = selectedCourse === course;
    // Get count: full length for 'All', otherwise count for specific course
    const itemCount = course === 'All' ? menuItems.length : countItemsInCourse(menuItems, course);

    return (
      <TouchableOpacity
        key={course}  // Unique key for list rendering
        // Apply base style, plus selected variant if active
        style={[
          styles.courseButton,
          isSelected && styles.courseButtonSelected,
        ]}
        onPress={() => setSelectedCourse(course)}  // Update state on press
      >
        {/* Course name text with conditional styling */}
        <Text style={[
          styles.courseButtonText,
          isSelected && styles.courseButtonTextSelected,
        ]}>
          {course}
        </Text>
        {/* Item count badge with conditional styling */}
        <Text style={[
          styles.courseCount,
          isSelected && styles.courseCountSelected,
        ]}>
          {itemCount}
        </Text>
      </TouchableOpacity>
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
        {/* Header section with back button and title */}
        <View style={styles.header}>
          {/* Absolute-positioned back button */}
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filter Menu</Text>
          <Text style={styles.headerSubtitle}>Select a course to view</Text>
        </View>

        {/* Filter controls section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filter by Course:</Text>
          {/* Container for course buttons, laid out in a row with wrapping */}
          <View style={styles.courseButtonContainer}>
            {COURSES.map((course) => renderCourseButton(course))}  {/* Map over courses to render buttons */}
          </View>
        </View>

        {/* Results summary section */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsText}>
            {/* Dynamic text showing count and course context */}
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            {selectedCourse !== 'All' && ` in ${selectedCourse}`}
          </Text>
        </View>

        {/* Menu items display section */}
        <View style={styles.menuSection}>
          {/* Conditional rendering: empty state or FlatList */}
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No dishes found</Text>
              <Text style={styles.emptyStateSubtext}>
                {/* Dynamic subtext based on filter */}
                {selectedCourse === 'All' 
                  ? 'No menu items have been added yet'
                  : `No dishes in ${selectedCourse} course`}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}  // Data source: filtered items
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
  // Back button positioned absolutely in header
  backButton: {
    position: 'absolute',
    left: 15,
    top: 50,
    padding: 10,
  },
  // White bold text for back button
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  // Filter section with white background, margins, padding, and subtle shadow/elevation
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
  // Label for filter section: semi-bold, dark color
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  // Horizontal layout for course buttons with wrapping and gaps
  courseButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  // Base style for course buttons: light background, bordered, pill-shaped
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
  // Selected variant: red background and border
  courseButtonSelected: {
    backgroundColor: '#ff0000',
    borderColor: '#ff0000',
  },
  // Base text for course name: medium gray, semi-bold
  courseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  // Selected text: white
  courseButtonTextSelected: {
    color: '#fff',
  },
  // Base count badge: small, bold, light gray
  courseCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
  },
  // Selected count: light peach
  courseCountSelected: {
    color: '#FFE5D9',
  },
  // Margins for results section
  resultsSection: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  // Italic gray text for results summary
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  // Margins for menu section with bottom padding
  menuSection: {
    margin: 15,
    marginBottom: 30,
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
export default FilterScreen;