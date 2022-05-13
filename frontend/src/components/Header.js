import React from "react"
import Logo from './Logo'
import Title from '../styles/title/Title'
import { Button } from '../styles/button/Button'

const Header = () => {
  let companyName = "CCT"
  const companyAddress = <p>Ubon</p>
  let num = 10
  const showMessage = () => {
    return companyName + ".com"
  };
  const isLogin = false
  const showMe = () => {
      alert('Hello React')
  }
  const products = [
      {id: 1, name: 'Coke'},
      {id: 2, name: 'Pepsi'}
  ]

  return (
    <>
      <Title>Hello React</Title>
      <h1>บริษัท {companyName}</h1>
      {companyAddress}
      {num + 100} <br />
      {showMessage()}
      { isLogin === true && (
            <>
                <p>ยินดีต้อนรับ</p>
                <p>ยินดีต้อนรับ 2</p>
            </>
      ) }
      {
          isLogin ? <Logo /> : <p>ไม่มีสิทธิ์ดู logo</p>
      }
      <br />
      {/* <button onClick={showMe}>Click Me!</button> */}
      <Button primary onClick={showMe}>Click Me!</Button>
      <br />
      <ul>
        {
            products.map((product, index) => {
                return (
                    <li key={product.id}>{product.name} {index+1}</li>
                )
            })
        }
      </ul>
      <hr />
    </>
  );
};

export default Header;
