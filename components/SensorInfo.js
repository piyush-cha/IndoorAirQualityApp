import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Cloud } from 'lucide-react-native';

const SensorInfo = ({ theme = lightTheme }) => {
  return (
    <View style={styles.container}>
      <View style={styles.weatherContainer}>
        <Cloud size={20} color={theme.text.color} style={styles.icon} />
        <Text style={[styles.temperature, theme.text]}>7°C</Text>
        <Text style={[styles.location, theme.secondaryText]}>in Berlin</Text>
      </View>
      <Text style={[styles.description, theme.secondaryText]}>Partially Cloudy</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  temperature: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  location: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    marginLeft: 28, // Aligns with text after icon
  },
});

const lightTheme = {
  text: {
    color: '#1f2937',
  },
  secondaryText: {
    color: '#6b7280',
  },
};

export default SensorInfo;