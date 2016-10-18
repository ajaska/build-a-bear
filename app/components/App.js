import React from 'react';
import MainPage from '../containers/MainPage';
import ChooseSemester from '../containers/ChooseSemester';

function App() {
  return (
    <ChooseSemester>
      <MainPage />
    </ChooseSemester>
  );
}

export default App;
