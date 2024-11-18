import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Switch, ScrollView } from 'react-native';
import { ChevronRight, ArrowLeft, Camera, Edit2, Bell, Lock, Moon, HelpCircle, Info, LogOut } from 'lucide-react-native';
import { auth } from '../config';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../ThemeContext';

export default function ProfileScreen({ route }) {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        displayName: currentUser.displayName || 'User',
        email: currentUser.email,
        photoURL: currentUser.photoURL || 'https://via.placeholder.com/150',
      });
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.replace('Auth');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleEditProfileImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUser(prevUser => ({ ...prevUser, photoURL: result.assets[0].uri }));
    }
  };

  const MenuItem = ({ title, icon: Icon, onPress }) => (
    <TouchableOpacity 
      style={[styles.menuItem, { borderBottomColor: theme.borderColor }]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <Icon size={20} color={theme.text} />
        <Text style={[styles.menuText, { color: theme.text }]}>{title}</Text>
      </View>
      <ChevronRight size={20} color={theme.secondaryText} />
    </TouchableOpacity>
  );

  if (!user) {
    return <View style={[styles.container, { backgroundColor: theme.background }]}><Text style={{ color: theme.text }}>Loading...</Text></View>;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: user.photoURL }} 
            style={styles.profileImage} 
          />
          <TouchableOpacity style={styles.editImageButton} onPress={handleEditProfileImage}>
            <Camera size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{user.displayName}</Text>
        <Text style={[styles.email, { color: theme.secondaryText }]}>{user.email}</Text>

        <TouchableOpacity 
          style={[styles.editProfileButton, { backgroundColor: theme.cardBackground }]}
          onPress={() => navigation.navigate('EditProfile', { user, theme })}
        >
          <Edit2 size={20} color={theme.text} />
          <Text style={[styles.editProfileText, { color: theme.text }]}>Edit Profile</Text>
        </TouchableOpacity>

        <View style={styles.menuContainer}>
          <MenuItem title="Notifications" icon={Bell} onPress={() => {}} />
          <MenuItem title="Privacy" icon={Lock} onPress={() => {}} />
          <View style={[styles.menuItem, styles.switchItem, { borderBottomColor: theme.borderColor }]}>
            <View style={styles.menuItemLeft}>
              <Moon size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </View>
          <MenuItem title="Help" icon={HelpCircle} onPress={() => {}} />
          <MenuItem title="About" icon={Info} onPress={() => {}} />
          <MenuItem title="Logout" icon={LogOut} onPress={handleSignOut} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 120,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
  email: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
  },
  switchItem: {
    justifyContent: 'space-between',
  },
});