# 🎟️ PixelWand Ticket Booking App

A beautifully designed, fully-featured ticket booking app built with **React Native (Expo) + TypeScript**. Users can explore events, book tickets with dynamic seat selection, and manage their bookings — all with a smooth, responsive interface and persistent state.

## 🚀 Tech Stack

- **Expo + TypeScript**
- **React Navigation** (Stack + Tab)
- **React Native Animated API**
- **AsyncStorage** (via `@react-native-async-storage/async-storage`)
- **Context API + useReducer**
- **Mock API with `json-server`**
- **Axios** for data fetching

---

## 📱 Screens & Navigation

### 🔹 **Home (Event List)**

- Fetches mock events from local or public JSON API
- Beautiful `FlatList` layout with cards showing:
  - Title
  - Date & Time
  - Location
  - Price
  - Event Image
- **Search + Filter** with animated, sticky header UI

### 🔹 **Event Detail**

- Detailed view of event info with:
  - Interactive ticket selector (+ / – up to 10)
  - Book Tickets button
- Seat & capacity info
- Smooth page transitions

### 🔹 **Bookings ("My Tickets")**

- Bottom Tab Navigator with Home + Bookings
- List of booked events
- Quantity and total cost per booking
- Option to cancel individual bookings

---

## 🎯 Core Features

✅ **Navigation**: Stack + Tabs  
✅ **State Management**: `Context + useReducer`  
✅ **Persistence**: `AsyncStorage` via `useBookingsStorage()` hook  
✅ **Data Fetching**: Axios  
✅ **Animations**: Smooth animated header scroll + button micro-interactions  
✅ **Responsive UI** with gradient colors, shadows, and spacing  
✅ **Production-level structure** with modular components

---

## ✨ Bonus Features Implemented

- 🔍 **Search & Filter** on Home screen
- 🎞️ **Animated Scroll Header** with frosted glass effect
- ❌ **Booking Cancellation** functionality
- 💾 **Data persistence** even after app restart
- 🧠 **Custom Hooks** for managing AsyncStorage
- 🎨 **Gradient styling** with smooth transitions

---

## 🏗️ Folder Structure

app/
\_layout.tsx
(tabs)/
\_layout.tsx
index.tsx # Home screen
bookings.tsx # My Tickets screen
event/[id].tsx # Event Detail screen

components/
EventCard.tsx
SearchBar.tsx
FilterChips.tsx
BookingCard.tsx
LoadingSpinner.tsx
EmptyState.tsx

contexts/
BookingContext.tsx

data/
mockEvents.ts

hooks/
useBookingsStorage.ts

assets/
images/

---

## ⚙️ Setup Instructions

### 1. 📦 Install Dependencies

```bash
npm install
npx expo install @react-native-async-storage/async-storage

### 2. ▶️ Run the App

npm expo start

```
