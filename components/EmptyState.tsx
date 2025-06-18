import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ticket } from 'lucide-react-native';

interface EmptyStateProps {
  message?: string;
  submessage?: string;
}

export function EmptyState({ 
  message = 'No bookings yet',
  submessage = 'Your booked tickets will appear here'
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ticket size={64} color="#D1D5DB" />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.submessage}>{submessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  message: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
    marginTop: 16,
    textAlign: 'center',
  },
  submessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
});