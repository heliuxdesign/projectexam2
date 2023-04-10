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

/*function Layout() {
  return (
        <Router>
          <Navbar bg="dark" variant="dark" expand="lg">
            <NavLink to="/" exact>
              <Navbar.Brand>SOME</Navbar.Brand>
            </NavLink>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
                <NavLink to="/posts" className="nav-link">
                  Posts
                </NavLink>
                <NavLink to="/profiles" className="nav-link">
                  Profiles
                </NavLink>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Container>
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/profiles" element={<Profiles />} />
            </Routes>
          </Container>
        </Router>
      );
}

export default Layout;*/

function Navigation() {
  return (
  <>
   <Navbar bg="dark" variant="dark" expand="lg">
            <NavLink to="/" exact>
              <Navbar.Brand>SOME</Navbar.Brand>
            </NavLink>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <NavLink to="/home" className="nav-link">
                  Home
                </NavLink>
                <NavLink to="/posts" className="nav-link">
                  Posts
                </NavLink>
                <NavLink to="/profiles" className="nav-link">
                  Profiles
                </NavLink>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
  </>
  );
}
export default Navigation;