import React, { Component } from 'react'
import ProductTable from './ProductTable'
import SearchBar from './SearchBar'

const productListMock = [
    {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
    {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
    {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
    {category: "Electronics", price: "$99.99", stocked: true, name: "Ipod Touch"},
    {category: "Electronics", price: "$399.99", stocked: false, name: "Iphone 5"},
    {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"},
]

const fetchAPI = () => Promise.resolve(productListMock)


class FilterableProductTable extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       productList: [],
       searchText: '',
       inStock: false
    }
  }

  componentDidMount() {
    fetchAPI().then(res =>{
      this.setState({
        productList: res
      })
    })
  }

  handleChange = (event) => {
    const name = event.target.name;
    console.log("name", name)
    if(name === "product") {
      this.setState({
        searchText: event.target.value
      })
    } else if(name === "inStock") {
      this.setState({
        inStock: event.target.checked
      })
    }
  } 
  render() {
    const {productList, searchText, inStock} = this.state;

    return (
      <div className='container'>
        <SearchBar searchText={searchText} inStock={inStock} handleChange={this.handleChange}/>
        <ProductTable productList={productList} 
          searchText={searchText} inStock={inStock}
        />
      </div>
    )
  }
}

export default FilterableProductTable