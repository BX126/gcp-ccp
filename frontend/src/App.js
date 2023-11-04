import * as React from 'react';
import { TopBar} from './view/topbar';
import { WelcomePage } from './view/welcomepage';
import { HomePage } from './view/homepage';
import { DataPage } from './view/datapage';
import { ResultPage } from './view/resultpage';
import { ProcessPage } from './view/processpage';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Charter", serif'
  }
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
        <TopBar />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/process" element={<ProcessPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
