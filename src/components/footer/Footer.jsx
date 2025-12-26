import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa';
import './Footer.css'; // Ensure you have a CSS file for styling

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Shajid College of Nursing and Midwifery. All rights reserved.</p>

        <p>
  Designed & Developed by{' '}
  <a
    href="https://www.linkedin.com/in/kevin-cross-minchakpu-7897379a"
    target="_blank"
    rel="noopener noreferrer"
    className="kevin-link"
  >
    Kevin Cross Minchakpu
  </a>{' '}
  | Powered by{' '}
  <a
    href="https://octatesystems.github.io/OSNigeria/"
    target="_blank"
    rel="noopener noreferrer"
    className="octate-link"
  >
    Octate Systems
  </a>
</p>

        <nav className="footer-links">
          <a href="/">Home</a> | 
          <a href="/programs">Programs</a> | 
          <a href="/apply">Apply</a> | 
          <a href="/contact">Contact</a>
        </nav>

        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube />
          </a>
          <a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </footer>
  );
}