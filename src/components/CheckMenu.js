
import './CheckMenu.css'

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function CheckMenu() {
  return (
    <DropdownButton id="dropdown-basic-button" title="Show Places" className='shadow' size='lg'>
      <Dropdown.Item href="#/action-1">Hotels</Dropdown.Item>
      <Dropdown.Item href="#/action-2">Restaurants</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Shopping</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Fun</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Historical</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Sightseeing</Dropdown.Item>
    </DropdownButton>
  );
}

export default CheckMenu;