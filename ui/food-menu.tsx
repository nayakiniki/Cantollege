import { FoodCard } from "@/components/food-card"

const foodItems = [
  {
    id: "1",
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 30,
    category: "snacks",
    isVeg: true,
    image: "/images/samosa.jpg",
  },
  {
    id: "2",
    name: "Vada Pav",
    description: "Spicy potato fritter in a bun with chutneys",
    price: 40,
    category: "snacks",
    isVeg: true,
    image: "/images/vada-pav.jpg",
  },
  {
    id: "3",
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potato filling",
    price: 80,
    category: "main-course",
    isVeg: true,
    image: "/images/masala-dosa.jpg",
  },
]

export function FoodMenu() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-audiowide text-indigo-400 text-center">Menu</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {foodItems.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
