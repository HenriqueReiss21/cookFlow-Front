import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

// Import the icon names type from @expo/vector-icons
import { FontAwesome as FontAwesomeType } from "@expo/vector-icons/build/Icons";

// Define the props interface for the Header component
interface HeaderProps {
  headerText: string;
  headerIcon: keyof typeof FontAwesomeType.glyphMap; // This ensures only valid FontAwesome icon names are accepted
}

const Header: React.FC<HeaderProps> = ({ headerText, headerIcon }) => {
  return (
    <View style={{flexDirection: "row"}}>
      <Text style={{ flex: 1, fontSize: 22, fontWeight: "700" }}>{headerText}</Text>
      <FontAwesome name={headerIcon} size={24} color="#f96163" />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});