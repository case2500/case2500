import Footer from './components/Footer'
import Header from './components/Header'
import Logo from './components/Logo'
import './App.css'
import Sidebar from './components/Sidebar'
import Menu from './components/Menu'

function AppV1() {
  return (
    <div className="logo">
          <Logo />

          <Header />

          <Footer title='Facebook' website='www.facebook.com' postcode={11000} isOpen />
    
          <hr />

          <Sidebar />

          <hr />
          <Menu />

    </div>
  );
}

export default AppV1
