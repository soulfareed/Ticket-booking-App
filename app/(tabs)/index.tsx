import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { EventCard } from '@/components/EventCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterChips } from '@/components/FilterChips';
import { mockEvents } from '@/data/mockEvents';
import { Event } from '@/contexts/BookingContext';

const HEADER_HEIGHT = 200;
const SEARCH_BAR_HEIGHT = 60;
const FILTER_HEIGHT = 60;
const STICKY_HEADER_HEIGHT = SEARCH_BAR_HEIGHT + FILTER_HEIGHT;

export default function EventsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(mockEvents.map((event) => event.category)));
    return cats.sort();
  }, []);

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === null || event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleEventPress = (event: Event) => {
    router.push(`/event/${event.id}`);
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <EventCard event={item} onPress={() => handleEventPress(item)} />
  );

  // Header animation values
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.5, HEADER_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  // Sticky header animation values
  const stickyHeaderTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - STICKY_HEADER_HEIGHT, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT, STICKY_HEADER_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  const stickyHeaderOpacity = scrollY.interpolate({
    inputRange: [HEADER_HEIGHT - STICKY_HEADER_HEIGHT, HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Status bar background opacity
  const statusBarOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.7, HEADER_HEIGHT],
    outputRange: [0, 0.3, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Animated Status Bar Background */}
      <Animated.View
        style={[
          styles.statusBarBackground,
          {
            opacity: statusBarOpacity,
          },
        ]}
      />

      {/* Main Header */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          },
        ]}
      >
        <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Discover Events</Text>
            <Text style={styles.headerSubtitle}>
              Find amazing experiences near you
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Sticky Search and Filter Header */}
      <Animated.View
        style={[
          styles.stickyHeader,
          {
            transform: [{ translateY: stickyHeaderTranslateY }],
            opacity: stickyHeaderOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
          style={styles.stickyHeaderGradient}
        >
          <View style={styles.stickyHeaderContent}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search events..."
            />
            <FilterChips
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Events List */}
      <Animated.FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          { paddingTop: HEADER_HEIGHT },
        ]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search events..."
            />
            <FilterChips
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  statusBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24,
    backgroundColor: '#6366F1',
    zIndex: 1000,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 100,
  },
  header: {
    flex: 1,
    paddingTop:
      Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: STICKY_HEADER_HEIGHT,
    zIndex: 200,
  },
  stickyHeaderGradient: {
    flex: 1,
    paddingTop:
      Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  stickyHeaderContent: {
    flex: 1,
    paddingTop: 8,
  },
  listContainer: {
    paddingBottom: 100,
  },
  listHeader: {
    backgroundColor: 'transparent',
    paddingTop: 16,
  },
});
