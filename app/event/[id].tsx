import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  Alert 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Minus,
  Plus 
} from 'lucide-react-native';
import { mockEvents } from '@/data/mockEvents';
import { useBooking } from '@/contexts/BookingContext';

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addBooking, getBookingByEventId } = useBooking();
  const [ticketCount, setTicketCount] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const event = mockEvents.find(e => e.id === id);
  const existingBooking = event ? getBookingByEventId(event.id) : null;

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleTicketChange = (increment: number) => {
    const newCount = ticketCount + increment;
    if (newCount >= 1 && newCount <= 10) {
      setTicketCount(newCount);
    }
  };

  const handleBooking = async () => {
    try {
      setIsBooking(true);
      await addBooking(event, ticketCount);
      
      Alert.alert(
        'Booking Confirmed!',
        `Successfully booked ${ticketCount} ticket${ticketCount > 1 ? 's' : ''} for ${event.title}`,
        [
          { text: 'View My Tickets', onPress: () => router.push('/bookings') },
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert('Booking Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const totalPrice = event.price * ticketCount;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.image} />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.imageOverlay}
          />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.imageContent}>
            <Text style={styles.category}>{event.category}</Text>
            <Text style={styles.imageTitle}>{event.title}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Calendar size={20} color="#6366F1" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>Date & Time</Text>
                <Text style={styles.detailText}>
                  {formatDate(event.date)} at {event.time}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <MapPin size={20} color="#6366F1" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>Location</Text>
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Users size={20} color="#6366F1" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>Capacity</Text>
                <Text style={styles.detailText}>{event.capacity.toLocaleString()} people</Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>About This Event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {!existingBooking && (
            <View style={styles.ticketContainer}>
              <Text style={styles.sectionTitle}>Select Tickets</Text>
              <View style={styles.ticketSelector}>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketPrice}>${event.price}</Text>
                  <Text style={styles.ticketLabel}>per ticket</Text>
                </View>
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={[styles.counterButton, ticketCount <= 1 && styles.counterButtonDisabled]}
                    onPress={() => handleTicketChange(-1)}
                    disabled={ticketCount <= 1}
                    activeOpacity={0.7}
                  >
                    <Minus size={20} color={ticketCount <= 1 ? '#D1D5DB' : '#6366F1'} />
                  </TouchableOpacity>
                  <Text style={styles.counterText}>{ticketCount}</Text>
                  <TouchableOpacity
                    style={[styles.counterButton, ticketCount >= 10 && styles.counterButtonDisabled]}
                    onPress={() => handleTicketChange(1)}
                    disabled={ticketCount >= 10}
                    activeOpacity={0.7}
                  >
                    <Plus size={20} color={ticketCount >= 10 ? '#D1D5DB' : '#6366F1'} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {existingBooking && (
            <View style={styles.alreadyBookedContainer}>
              <Text style={styles.alreadyBookedTitle}>Already Booked</Text>
              <Text style={styles.alreadyBookedText}>
                You have {existingBooking.quantity} ticket{existingBooking.quantity > 1 ? 's' : ''} for this event
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {!existingBooking && (
        <View style={styles.bottomContainer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>${totalPrice}</Text>
          </View>
          <TouchableOpacity
            style={[styles.bookButton, isBooking && styles.bookButtonDisabled]}
            onPress={handleBooking}
            disabled={isBooking}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.bookButtonGradient}
            >
              <Text style={styles.bookButtonText}>
                {isBooking ? 'Booking...' : `Book ${ticketCount} Ticket${ticketCount > 1 ? 's' : ''}`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  category: {
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  imageTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    lineHeight: 34,
  },
  content: {
    padding: 20,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
  },
  ticketContainer: {
    marginBottom: 24,
  },
  ticketSelector: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketInfo: {
    flex: 1,
  },
  ticketPrice: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  ticketLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  counterButtonDisabled: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  counterText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    minWidth: 24,
    textAlign: 'center',
  },
  alreadyBookedContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  alreadyBookedTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#065F46',
    marginBottom: 4,
  },
  alreadyBookedText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#047857',
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 20,
    paddingBottom: 40,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  totalPrice: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  bookButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 100,
  },
});