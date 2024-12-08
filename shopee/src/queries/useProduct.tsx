import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import { ProductListConfig } from 'src/types/product.type'

export const useProductList = (queryConfig: ProductListConfig) => {
  return useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    keepPreviousData: true
  })
}
