import React from 'react';
import Select from 'react-select';

class SemesterHeader extends React.Component {
  constructor(props) {
    super(props);

    this.handleSemesterChange = this.handleSemesterChange.bind(this);
    this.updateSemesterOptions = this.updateSemesterOptions.bind(this);
  }

  handleSemesterChange({ value }) {
    this.props.changedSemester({ term: value || '' });
  }

  updateSemesterOptions() {
    if (!this.props.choices || this.props.choices.length === 0) {
      this.props.updateSemesterOptions();
    }
  }

  render() {
    const semesterOptions = this.props.choices.map((item) => (
      { value: item.term, label: item.term }
    ));

    const resetValue = { value: '' };

    return (
      <div className="choose-semester-section">
        <h1 className="prefix">{this.props.career} -</h1>
        <Select
          className="semester-option"
          placeholder={this.props.term}
          value={this.props.term}
          options={semesterOptions}
          resetValue={resetValue}
          onChange={this.handleSemesterChange}
          onOpen={this.updateSemesterOptions}
          noResultsText={false}
          searchable={false}
          clearable={false}
        />
      </div>
    );
  }
}

SemesterHeader.propTypes = {
  career: React.PropTypes.string.isRequired,
  changedSemester: React.PropTypes.func.isRequired,
  choices: React.PropTypes.array.isRequired,
  term: React.PropTypes.string.isRequired,
  updateSemesterOptions: React.PropTypes.func.isRequired,
};

export default SemesterHeader;
