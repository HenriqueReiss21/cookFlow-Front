import { StyleSheet, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome } from "@expo/vector-icons";
import { useRecipes } from '../hooks/useRecipes';

interface SearchFilterProps {
  icon: string;
  placeholder: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ icon, placeholder }) => {
  const [searchText, setSearchText] = useState('');
  const { searchRecipes } = useRecipes();

  const handleSearch = (text: string) => {
    setSearchText(text);
    searchRecipes(text);
  };

  return (
    <View style={styles.container}>
      <FontAwesome name={icon} size={20} color="#f96163" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchText}
        onChangeText={handleSearch}
      />
    </View>
  );
};

export default SearchFilter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,

    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    // Sombra para Android
    elevation: 2,
  },
  input: {
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  }
});