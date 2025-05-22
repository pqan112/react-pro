import CartHeader from 'src/components/CartHeader'
import Footer from 'src/components/Footer'
type Props = {
  children?: React.ReactNode
}
const CartLayout = ({ children }: Props) => {
  return (
    <>
      <CartHeader />
      {children}
      <Footer />
    </>
  )
}

export default CartLayout
