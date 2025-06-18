import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface FilterChipsProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function FilterChips({ categories, selectedCategory, onSelectCategory }: FilterChipsProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <TouchableOpacity
          style={[styles.chip, selectedCategory === null && styles.chipSelected]}
          onPress={() => onSelectCategory(null)}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, selectedCategory === null && styles.chipTextSelected]}>
            All Events
          </Text>
        </TouchableOpacity>
        
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.chip, selectedCategory === category && styles.chipSelected]}
            onPress={() => onSelectCategory(category)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, selectedCategory === category && styles.chipTextSelected]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: 'rgba(249, 250, 251, 0.9)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.6)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    backdropFilter: 'blur(10px)',
  },
  chipSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.95)',
    borderColor: 'rgba(99, 102, 241, 0.8)',
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
});