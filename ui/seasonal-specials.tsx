export function SeasonalSpecials() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-audiowide text-indigo-400 text-center">Seasonal Specials</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg p-6">
          <h3 className="text-xl font-medium text-white">Spring Fresh Collection</h3>
          <p className="text-gray-400 mt-2">Celebrate spring with our fresh, seasonal menu items</p>
          <div className="mt-4 inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">15% OFF</div>
          <div className="mt-4 text-sm text-gray-500">Ends 6/15/2025</div>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg p-6">
          <h3 className="text-xl font-medium text-white">Limited Edition Fusion</h3>
          <p className="text-gray-400 mt-2">Exclusive fusion items available for a limited time only</p>
          <div className="mt-4 inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded">10% OFF</div>
          <div className="mt-4 text-sm text-gray-500">Ends 5/28/2025</div>
        </div>
      </div>

      <h3 className="text-2xl font-audiowide text-indigo-400 text-center mt-12">Featured Specials</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="relative h-64 bg-gray-700">
            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">NEW</div>
          </div>
          <div className="p-4">
            <h4 className="text-lg font-medium text-white">Garden Fresh Spring Salad</h4>
            <p className="text-gray-400 mt-1">A vibrant mix of spring vegetables with a light citrus dressing</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-bold text-indigo-400">₹120</span>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">Add to Cart</button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="relative h-64 bg-gray-700">
            <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
              LIMITED EDITION
            </div>
          </div>
          <div className="p-4">
            <h4 className="text-lg font-medium text-white">Fusion Masala Burger</h4>
            <p className="text-gray-400 mt-1">Indian spiced patty with mint chutney and pickled onions</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-bold text-indigo-400">₹150</span>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
