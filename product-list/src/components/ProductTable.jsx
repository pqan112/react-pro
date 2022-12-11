import React, { Component, Fragment } from 'react'
import ProductCategoryRow from './ProductCategoryRow'
import ProductRow from './ProductRow'

class ProductTable extends Component {
    
  render() {
    const { productList, inStock, searchText } = this.props;
    let lastCategory = null;
    const rows = [];
    productList.forEach((productItem) => {
      if(inStock && productItem.stocked) {
        return;
      }
      if(productItem.name.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
        return;
      }
      
      if(productItem.category !== lastCategory ) {
        rows.push(
                    <ProductCategoryRow 
                      key={productItem.category}
                      category={productItem.category}
                    />
                  )
      } 

      rows.push(
        <ProductRow 
          key={productItem.name}
          product={productItem}
          />
        )
        lastCategory = productItem.category
    })

    // let lastCategory = null;
    // const rows = productList.map((producItem) => {
    //   if(producItem.category !== lastCategory) {
    //     lastCategory = producItem.category;
    //     return (
    //       <Fragment key={producItem.name}>
    //         <ProductCategoryRow 
    //           category={producItem.category}
    //         />
    //         <ProductRow product={producItem}/>
    //       </Fragment>
    //     )
    //   }
    //   return (
    //     <ProductRow key={producItem.name} product={producItem}/>
    //   )
    // })



    return (
        <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
    </table>
    )
  }
}

export default ProductTable