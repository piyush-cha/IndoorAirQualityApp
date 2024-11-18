import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Wind, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

const TabNavigator = ({ activeTab = 'rooms', onTabChange }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const tabs = [
    { 
      id: 'rooms', 
      label: 'Home', 
      icon: Home,
      onPress: () => onTabChange('rooms')
    },
    { 
      id: 'airQuality', 
      label: 'Air Quality', 
      icon: Wind,
      onPress: () => onTabChange('airQuality')
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User,
      onPress: () => navigation.navigate('Profile', { theme })
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground, borderTopColor: theme.borderColor }]}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={tab.onPress}
          >
            <Icon
              size={24}
              color={isActive ? theme.text : theme.secondaryText}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? theme.text : theme.secondaryText },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TabNavigator;