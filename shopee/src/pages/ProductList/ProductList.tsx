import { useQuery } from '@tanstack/react-query'
import categoryApi from 'src/apis/category.api'
import productApi from 'src/apis/product.api'
import Pagination from 'src/components/Pagination'
import { QueryKeys } from 'src/constants/queryKey'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'
import AsideFilter from './components/AsideFilter'
import Product from './components/Product'
import SortProductList from './components/SortProductList'

const ProductList = () => {
  const queryConfig = useQueryConfig()
  const { data: productsData } = useQuery({
    queryKey: [QueryKeys.products, queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: [QueryKeys.categories],
    queryFn: () => categoryApi.getCategories()
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
            </div>
            <div className='col-span-9'>
              <SortProductList
                queryConfig={queryConfig}
                pageSize={productsData.data.data.pagination.page_size}
              />
              <div className='gird-cols-2 mt-6 grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData
                  ? productsData.data.data.products.map((product) => (
                      <div className='col-span-1' key={product._id}>
                        <Product product={product} />
                      </div>
                    ))
                  : null}
              </div>
              <Pagination
                queryConfig={queryConfig}
                pageSize={productsData.data.data.pagination.page_size}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
