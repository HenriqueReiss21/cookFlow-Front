import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the navigation param list types
type RootStackParamList = {
  WelcomeScreen: undefined;
  ReceipeList: undefined;
};

// Define props interface for the component
interface WelcomeScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WelcomeScreen'>;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image source={require("../../assets/images/salada.png")} />

      <Text style={{ color: "#f96163", fontSize: 22, fontWeight: "bold" }}>
        40K+ Premium Recepts
      </Text>

      <Text style={{ fontSize: 42, fontWeight: "bold", color: "#3c444c", marginTop: 44, marginBottom: 20 }}>
        Cook Like a Chef
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("ReceipeList")}
        style={{
          backgroundColor: "#f96163",
          borderRadius: 18,
          paddingVertical: 18,
          width: "80%",
          alignItems: "center"
        }}>
        <Text style={{ fontSize: 18, color: "#fff", fontWeight: "700" }}>
          Let's Go
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});