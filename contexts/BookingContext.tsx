import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  description: string;
  category: string;
  capacity: number;
}

export interface Booking {
  id: string;
  eventId: string;
  event: Event;
  quantity: number;
  totalPrice: number;
  bookingDate: string;
}

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

type BookingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BOOKINGS'; payload: Booking[] }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'REMOVE_BOOKING'; payload: string };

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};

function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload };
    case 'ADD_BOOKING':
      return { ...state, bookings: [...state.bookings, action.payload] };
    case 'REMOVE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.filter(
          (booking) => booking.id !== action.payload
        ),
      };
    default:
      return state;
  }
}

interface BookingContextType {
  state: BookingState;
  addBooking: (event: Event, quantity: number) => Promise<void>;
  removeBooking: (bookingId: string) => Promise<void>;
  getBookingByEventId: (eventId: string) => Booking | undefined;
  getTotalBookings: () => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = '@pixelwand_bookings';

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Load bookings from AsyncStorage on app start
  useEffect(() => {
    loadBookings();
  }, []);

  // Save bookings to AsyncStorage whenever bookings change
  useEffect(() => {
    if (state.bookings.length > 0 || state.bookings.length === 0) {
      saveBookings();
    }
  }, [state.bookings]);

  const loadBookings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const bookings = JSON.parse(stored);
        dispatch({ type: 'SET_BOOKINGS', payload: bookings });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load bookings' });
      console.error('Error loading bookings:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveBookings = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookings));
    } catch (error) {
      console.error('Error saving bookings:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save booking' });
    }
  };

  const addBooking = async (event: Event, quantity: number) => {
    try {
      const booking: Booking = {
        id: Date.now().toString(),
        eventId: event.id,
        event,
        quantity,
        totalPrice: event.price * quantity,
        bookingDate: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_BOOKING', payload: booking });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add booking' });
      console.error('Error adding booking:', error);
    }
  };

  const removeBooking = async (bookingId: string) => {
    try {
      dispatch({ type: 'REMOVE_BOOKING', payload: bookingId });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove booking' });
      console.error('Error removing booking:', error);
    }
  };

  const getBookingByEventId = (eventId: string) => {
    return state.bookings.find((booking) => booking.eventId === eventId);
  };

  const getTotalBookings = () => {
    return state.bookings.reduce(
      (total, booking) => total + booking.quantity,
      0
    );
  };

  const value: BookingContextType = {
    state,
    addBooking,
    removeBooking,
    getBookingByEventId,
    getTotalBookings,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
