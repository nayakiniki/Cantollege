export type FoodItem = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isVeg: boolean
  customizations?: {
    name: string
    options: {
      id: string
      name: string
      price: number
    }[]
  }[]
}

export type Category = {
  id: string
  name: string
  description: string
}

export type CartItem = {
  id: string
  foodItem: FoodItem
  quantity: number
  customizations?: {
    name: string
    option: {
      id: string
      name: string
      price: number
    }
  }[]
  totalPrice: number
}

export type Order = {
  id: string
  items: CartItem[]
  totalAmount: number
  status: "Placed" | "Preparing" | "Ready for Pickup" | "Completed"
  timestamp: number
}

export const categories: Category[] = [
  {
    id: "snacks",
    name: "Snacks",
    description: "Quick bites to satisfy your cravings",
  },
  {
    id: "main-course",
    name: "Main Course",
    description: "Hearty meals to fuel your day",
  },
  {
    id: "beverages",
    name: "Beverages",
    description: "Refreshing drinks to quench your thirst",
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Sweet treats to end your meal",
  },
]

export const foodItems: FoodItem[] = [
  {
    id: "samosa",
    name: "Crispy Samosa",
    description: "Deep-fried pastry with spiced potato filling",
    price: 15,
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/samosa-recipe.webp",
    category: "snacks",
    isVeg: true,
    customizations: [
      {
        name: "Spice Level",
        options: [
          { id: "mild", name: "Mild", price: 0 },
          { id: "medium", name: "Medium", price: 0 },
          { id: "spicy", name: "Spicy", price: 0 },
        ],
      },
    ],
  },
  {
    id: "vada-pav",
    name: "Vada Pav",
    description: "Spicy potato fritter in a bun with chutneys",
    price: 20,
    image: "https://blog.swiggy.com/wp-content/uploads/2024/11/Image-1_mumbai-vada-pav-1024x538.png",
    category: "snacks",
    isVeg: true,
  },
  {
    id: "maggi",
    name: "Masala Maggi",
    description: "Classic instant noodles with a spicy twist",
    price: 30,
    image: "https://nfcihospitality.com/wp-content/uploads/2024/09/types-of-Maggi-Noodles-1.jpg",
    category: "snacks",
    isVeg: true,
    customizations: [
      {
        name: "Add-ons",
        options: [
          { id: "cheese", name: "Cheese", price: 10 },
          { id: "veggies", name: "Veggies", price: 5 },
          { id: "egg", name: "Egg", price: 15 },
        ],
      },
    ],
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese with spices and veggies",
    price: 80,
    image: "https://sharethespice.com/wp-content/uploads/2024/02/Paneer-Tikka-Featured.jpg",
    category: "main-course",
    isVeg: true,
  },
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    description: "Fragrant rice dish with spiced chicken",
    price: 120,
    image: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg",
    category: "main-course",
    isVeg: false,
    customizations: [
      {
        name: "Portion Size",
        options: [
          { id: "half", name: "Half", price: -30 },
          { id: "full", name: "Full", price: 0 },
        ],
      },
      {
        name: "Spice Level",
        options: [
          { id: "mild", name: "Mild", price: 0 },
          { id: "medium", name: "Medium", price: 0 },
          { id: "spicy", name: "Spicy", price: 0 },
        ],
      },
    ],
  },
  {
    id: "chole-bhature",
    name: "Chole Bhature",
    description: "Spicy chickpea curry with fried bread",
    price: 70,
    image: "https://thewhiskaddict.com/wp-content/uploads/2024/08/IMG_0727-4-scaled.jpg",
    category: "main-course",
    isVeg: true,
  },
  {
    id: "masala-dosa",
    name: "Masala Dosa",
    description: "Crispy rice crepe with spiced potato filling",
    price: 60,
    image:
      "https://i0.wp.com/binjalsvegkitchen.com/wp-content/uploads/2015/12/Masala-Dosa-L1.jpg?resize=600%2C900&ssl=1",
    category: "main-course",
    isVeg: true,
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    description: "Chilled coffee with ice cream",
    price: 50,
    image: "https://bakewithshivesh.com/wp-content/uploads/2021/04/IMG_3613-scaled.jpg",
    category: "beverages",
    isVeg: true,
    customizations: [
      {
        name: "Add-ons",
        options: [
          { id: "extra-cream", name: "Extra Cream", price: 10 },
          { id: "chocolate-syrup", name: "Chocolate Syrup", price: 5 },
        ],
      },
    ],
  },
  {
    id: "masala-chai",
    name: "Masala Chai",
    description: "Spiced tea with milk",
    price: 15,
    image: "https://shivanilovesfood.com/wp-content/uploads/2022/08/Chai-6.jpg",
    category: "beverages",
    isVeg: true,
  },
  {
    id: "mango-lassi",
    name: "Mango Lassi",
    description: "Sweet yogurt drink with mango pulp",
    price: 40,
    image: "https://annikaeats.com/wp-content/uploads/2024/03/DSC_1071.jpg",
    category: "beverages",
    isVeg: true,
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    description: "Deep-fried milk solids soaked in sugar syrup",
    price: 25,
    image:
      "https://i0.wp.com/www.chitrasfoodbook.com/wp-content/uploads/2016/10/gulab-jamun-using-mix.jpg?w=1200&ssl=1",
    category: "desserts",
    isVeg: true,
  },
  {
    id: "chocolate-brownie",
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie with nuts",
    price: 35,
    image: "https://bakingwithgranny.co.uk/wp-content/uploads/2017/01/brownies2-500x375.jpg",
    category: "desserts",
    isVeg: true,
    customizations: [
      {
        name: "Toppings",
        options: [
          { id: "ice-cream", name: "Ice Cream", price: 15 },
          { id: "chocolate-sauce", name: "Chocolate Sauce", price: 10 },
        ],
      },
    ],
  },
]
