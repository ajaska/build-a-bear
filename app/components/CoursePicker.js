import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

class CoursePicker extends React.Component {
  handleChange(event) {
    this.props.setCCN({ccn: event.target.value})
  }

  validateCCN(ccn) {
    return ccn === "33647"
  }

  render() {
    return (
      <div>
        <div>
          This is the course picker.
        </div>
        <div>
          <input
            type="text"
            value={this.props.coursePicker.ccn}
            onChange={this.handleChange.bind(this)}
          />
        </div>
      </div>
    )
  }
}

CoursePicker.propTypes = {
  coursePicker: ImmutablePropTypes.mapContains({
    ccn: React.PropTypes.string.isRequired,
    sections: ImmutablePropTypes.list.isRequired,
    dept: React.PropTypes.string.isRequired,
    dept_number: React.PropTypes.string.isRequired,
  }).isRequired
}

export default CoursePicker;
