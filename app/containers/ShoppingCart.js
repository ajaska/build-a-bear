import { connect } from 'react-redux';
import ShoppingCart from '../components/ShoppingCart';

const mapStateToProps = (state, ownProps) => {
  return { courses: state.shoppingCart.get('courses') }
}

export default connect(mapStateToProps)(ShoppingCart);
