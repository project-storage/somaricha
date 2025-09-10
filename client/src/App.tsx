import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import Topaboutme from "./components/shared/Topaboutme"
// Import Bootstrap CSS
// import 'bootstrap/dist/css/bootstrap.min.css'
// // Import Bootstrap JS
// import 'bootstrap/dist/js/bootstrap.min.js'
// // Custom CSS
import './styles/custom.scss';
import ProductSlider from "./components/shared/ProductSlider";

function App() {
  return (
    <>
      <Navbar />
      <Topaboutme/>
       <ProductSlider />
      <main>{/* Your main content goes here */}</main>
      <Footer />
    </>
  );
}

export default App;
