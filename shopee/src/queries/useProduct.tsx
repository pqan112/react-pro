import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import { QueryKeys } from 'src/constants/queryKey'
import { ProductListConfig } from 'src/types/product.type'

export const useProductList = (queryConfig: ProductListConfig) => {
  return useQuery({
    queryKey: [QueryKeys.products, queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    keepPreviousData: true
  })
}
