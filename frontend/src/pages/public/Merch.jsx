import { useQuery } from '@tanstack/react-query'
import { merchandiseApi } from '../../services/api'
import { useTheme } from '../../context/ThemeContext'

const Merch = () => {
  const { band } = useTheme()
  const { data: merchandise, isLoading } = useQuery({
    queryKey: ['merchandise'],
    queryFn: async () => {
      const response = await merchandiseApi.getMerchandise()
      return response.data
    },
  })

  if (isLoading) {
    return <div className="py-16 text-center">Loading merchandise...</div>
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center">{band.nav_merch || 'Merch'}</h1>
        
        {merchandise && merchandise.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {merchandise.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {item.image_url ? (
                  <div className="h-64 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  {item.description && (
                    <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                  )}
                  {item.category && (
                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  )}
                  {item.price != null && (
                    <p className="text-2xl font-bold text-green-600 mb-4">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  )}
                  {item.sizes_available && item.sizes_available.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-1">Available Sizes:</p>
                      <div className="flex gap-2">
                        {item.sizes_available.map((size) => (
                          <span key={size} className="px-2 py-1 bg-gray-100 text-xs rounded">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className={`text-sm ${item.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                    {item.in_stock ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-gray-600">No merchandise available at the moment.</p>
        )}
      </div>
    </div>
  )
}

export default Merch
