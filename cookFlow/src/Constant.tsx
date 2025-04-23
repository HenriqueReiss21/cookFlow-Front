export const colors = {
    COLOR_PRIMARY: '#f96163',
    COLOR_LIGHT: '#fff',
    COLOR_DARK: '#000',
    COLOR_DARK_ALT: "#262626",
};

interface Category {
    id: string;
    category: string;
}

export const categories: Category[] = [
    {
        id: "01",
        category: "Breakfest",
    },
    {
        id: "02",
        category: "Lunch",
    },
    {
        id: "03",
        category: "Dinner"
    }
];


export const recipeList = [
    {
    id: "01",
    name: "Tuna Tartare",
    image: require("../assets/images/tuna.png"),
    rating: "4.2",
    ingredients: ["Fresh Tuna", "Lime Juice", "Red Onion", "Avocado"],
    time: "40 mins",
    difficulty: "Medium",
    calories: "420 cal",
    }, 
    {
    id: "01",
    name: "Tuna Tartare",
    image: require("../assets/images/tuna.png"),
    rating: "4.2",
    ingredients: ["Fresh Tuna", "Lime Juice", "Red Onion", "Avocado"],
    time: "40 mins",
    difficulty: "Medium",
    calories: "420 cal",
    },
    {
    id: "01",
    name: "Tuna Tartare",
    image: require("../assets/images/tuna.png"),
    rating: "4.2",
    ingredients: ["Fresh Tuna", "Lime Juice", "Red Onion", "Avocado"],
    time: "40 mins",
    difficulty: "Medium",
    calories: "420 cal",
    },

]