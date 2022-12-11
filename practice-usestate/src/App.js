import './App.css';
import { useState } from 'react';

function App() {
  const [firstName, setFirstName] = useState("An");
  const [age, setAge] = useState(22);
  const [address, setAddress] = useState({
    nation: 'Vietnam',
    city: {
      street: 'Nguyen Van Luong',
      house: 'Building'
    }
  })

  const increaseAge = () => {
    setAge((prevState) => prevState + 1)
  }

  const handleChangeStreet = () => {
    setAddress((prevState) => {
      const newCity = {...prevState.city};
      newCity.street = "Hai Ba Trung"
      newCity.house = "Villa"
      return {
        ...prevState,
        city: newCity
      }
    })
  }
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
