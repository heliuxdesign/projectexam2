import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    NavLink,
  } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Home from '../home/Home';
import Posts from '../posts/Posts';
import Profiles from '../profiles/Profiles';
import Button from 'react-bootstrap/Button';
import { clearStorage } from '../Storage.js';


function Navigation() {

  const onClickHandler = () => {
    clearStorage();
  };

  return (
  <>
  <Navbar bg="dark" variant="dark" expand="lg">
    <NavLink to="/" exact>
      <Navbar.Brand>SOME</Navbar.Brand>
    </NavLink>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <NavLink to="/home" className="nav-link">Home</NavLink>
        <NavLink to="/posts" className="nav-link">Posts</NavLink>
        <NavLink to="/profiles" className="nav-link">Profiles</NavLink>
        <NavLink to="/" className="nav-link" onClick={onClickHandler}>Log out</NavLink>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  </>
  );
}
export default Navigation;