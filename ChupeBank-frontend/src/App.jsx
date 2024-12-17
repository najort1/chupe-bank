import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import routes from './rotas';

function App() {

  return (
    <Router>
      <Routes>
        {routes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
