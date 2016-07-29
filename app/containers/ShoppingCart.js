import { connect } from 'react-redux';
import { changedCCN } from '../actions/coursePicker';
import ShoppingCart from '../components/ShoppingCart';

const mapStateToProps = (state) => (
  { courses: state.shoppingCart.get('courses') }
);

const mapDispatchToProps = (dispatch) => ({
  setCCN: (ccn) => {
    dispatch(changedCCN(ccn));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
