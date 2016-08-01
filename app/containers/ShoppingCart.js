import { connect } from 'react-redux';
import { changedCCN } from '../actions/coursePicker';
import { dropCartCourse } from '../actions/api';
import ShoppingCart from '../components/ShoppingCart';

const mapStateToProps = (state) => ({
  courses: state.shoppingCart.get('courses'),
  disabled: state.coursePicker.get('isDroppingCartCourse'),
});

const mapDispatchToProps = (dispatch) => ({
  setCCN: (ccn) => {
    dispatch(changedCCN(ccn));
  },
  dropCartCourse: ({ ccn }) => {
    dispatch(dropCartCourse({ ccn }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
