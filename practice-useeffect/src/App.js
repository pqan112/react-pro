import './App.css';
import { useEffect, useState } from 'react';

const initialAddress = () => {
  return {
    nation: 'Vietnam',
    city: {
      street: '162 Ng Van Luong',
      house: 'building'
    }
  }
}

const getAddress = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        nation: 'Vietnam',
        city: {
          street: '162 Hai Ba Trung',
          house: 'department'
        }
      })
    }, 3000);
  })
}

function App() {
  const [firstName, setFirstName] = useState("An");
  const [age, setAge] = useState(22);
  const [address, setAddress] = useState(initialAddress)

  const increaseAge = () => {
    setAge((prevState) => prevState + 1)
  }

  const handleChangeStreet = () => {
    setAddress((prevState) => {
      const newCity = {...prevState.city};
      newCity.street = "100 Nicolas, NY"
      newCity.house = "Villa"
      return {
        ...prevState,
        city: newCity
      }
    })
  }

  // useEffect này sẽ chạy khi component re-render
  // useEffect(() => {
  //   console.log("chạy sau khi component re-render")
  // })


  // useEffect chỉ chạy 1 lần trong lần render đầu tiên
  // thường dùng để gọi api
  // useEffect(() => {
  //   getAddress().then((res) => {
  //     setAddress(res)
  //   })
  // }, [])
  

  // useEffect sẽ chạy khi dependency thay đổi giá trị
  // vì khi set lại address thì component re-render lại,
  // object address thay đổi tham chiếu nên nó lại chạy lại setAddress
  // tạo ra vòng lặp
  // useEffect(() => {
  //   getAddress().then((res) => {
  //     const newAddress = {...address}
  //     newAddress.city = res.city;
  //     setAddress(newAddress)
  //   })
  // }, [address])

  // có thể sửa lại như sau để không phải sử dụng dependency
  useEffect(() => {
    getAddress().then((res) => {
      setAddress(prevState => {
        const newAddress = {...prevState}
        newAddress.city = res.city;
        return newAddress;
      })
    })
  }, [])


 
  

  return (
    <div className="App">
      <ul>
        <li>First name: {firstName}</li>
        <li>Age: {age}</li>
        <li>Nation: {address.nation}</li>
        <li>Street: {address.city.street}</li>
        <li>House: {address.city.house}</li>
      </ul>
      <button onClick={increaseAge}>Increase age</button>
      <button onClick={handleChangeStreet}>Change street</button>
    </div>
  );
}

export default App;
