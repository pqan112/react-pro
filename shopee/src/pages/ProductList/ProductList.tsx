import { useQuery } from '@tanstack/react-query'
import { omitBy, isUndefined } from 'lodash'

import productApi from 'src/apis/product.api'
import Pagination from 'src/components/Pagination'
import useQueryParams from 'src/hooks/useQueryParams'
import { ProductListConfig } from 'src/types/product.type'
import AsideFilter from './components/AsideFilter'
import Product from './components/Product'
import SortProductList from './components/SortProductList'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

const ProductList = () => {
  const queryParams: QueryConfig = useQueryParams()

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '5',
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter
    },
    isUndefined
  )

  const { data } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true
  })
  console.log(data)

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {data ? (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter />
            </div>
            <div className='col-span-9'>
              <SortProductList
                queryConfig={queryConfig}
                pageSize={data.data.data.pagination.page_size}
              />
              <div className='gird-cols-2 mt-6 grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {data
                  ? data.data.data.products.map((product) => (
                      <div className='col-span-1' key={product._id}>
                        <Product product={product} />
                      </div>
                    ))
                  : null}
              </div>
              <Pagination
                queryConfig={queryConfig}
                pageSize={data.data.data.pagination.page_size}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProductList
