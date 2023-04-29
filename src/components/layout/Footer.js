import { Link } from 'react-router-dom';
import logo from '../../images/logo.png';


function Footer() {
  return (
    <footer className="centered">
      <p>SOME for everyone!<img src={logo} alt="logo-image" className="footer-logo"></img></p>
    </footer>
  );
}

export default Footer;