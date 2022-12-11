import React, { Component } from 'react'

class SearchBar extends Component {
  
  render() {
    const {searchText, inStock, handleChange} = this.props;
    return (
        <form>
            <div>
                <input 
                  type="text" 
                  placeholder='Search...' 
                  name='product'
                  value={searchText}
                  onChange={handleChange}  
                  />
            </div>
            <div>
                <input 
                  type="checkbox"
                  name='inStock'
                  value={inStock}
                  onChange={handleChange}
                  />
                  Only show products instock
            </div>
        </form>
    )
  }
}

export default SearchBar