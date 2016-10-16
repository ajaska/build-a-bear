import React from 'react';
import Select from 'react-select';

class SemesterHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const semesterOptions = [
      { value: 'fall2016', label: 'Fall 2016' },
      { value: 'spring2017', label: 'Spring 2017' }
    ];

    const resetValue = { value: '' };

    return (
      <div className="choose-semester-section">
        <h1 className="prefix">Undergraduate -</h1>
        <Select
          className="semester-option"
          placeholder="Grade option"
          value={"fall2016"}
          options={semesterOptions}
          resetValue={resetValue}
          searchable={false}
          clearable={false}
        />
      </div>
    )
  }
}

export default SemesterHeader;
