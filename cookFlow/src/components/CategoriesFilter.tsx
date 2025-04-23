import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { categories, colors } from "../Constant";

interface Category {
    id: string;
    category: string;
}

const CategoriesFilter: React.FC = () => {
    return(
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((category: Category, index: number) => {
                    return (
                        <View
                            key={category.id}
                            style={{
                                backgroundColor: index === 0 ? colors.COLOR_PRIMARY : colors.COLOR_LIGHT,
                                marginRight: 36,
                                borderRadius: 8,
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 7,
                                marginVertical: 16,
                            }}
                        >
                            <Text style={{color: index === 0 ? colors.COLOR_LIGHT : colors.COLOR_DARK, fontSize: 18}}>{category.category}</Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({});

export default CategoriesFilter;