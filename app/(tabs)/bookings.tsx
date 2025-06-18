import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBooking } from '@/contexts/BookingContext';
import { BookingCard } from '@/components/BookingCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { Booking } from '@/contexts/BookingContext';

export default function BookingsScreen() {
  const { state, removeBooking, getTotalBookings } = useBooking();

  const handleCancelBooking = async (bookingId: string) => {
    await removeBooking(bookingId);
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <BookingCard booking={item} onCancel={handleCancelBooking} />
  );

  if (state.loading) {
    return <LoadingSpinner message="Loading your bookings..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#EC4899', '#8B5CF6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Tickets</Text>
        <Text style={styles.headerSubtitle}>
          {getTotalBookings()} ticket{getTotalBookings() !== 1 ? 's' : ''} booked
        </Text>
      </LinearGradient>
      
      <View style={styles.content}>
        {state.bookings.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={state.bookings}
            renderItem={renderBooking}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
      
      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 16,
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
  content: {
    flex: 1,
    paddingTop: 16,
  },
  listContainer: {
    paddingBottom: 100,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});