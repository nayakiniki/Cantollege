interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  isVeg: boolean
  image: string
}

interface FoodCardProps {
  item: FoodItem
}

export function FoodCard({ item }: FoodCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
          <span className="text-xl font-medium text-gray-300">{item.name}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-medium text-white">{item.name}</h3>
        <p className="text-gray-400 mt-1">{item.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-indigo-400">₹{item.price}</span>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}
