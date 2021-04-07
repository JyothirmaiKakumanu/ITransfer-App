import './App.css';
import Header from './components/header';
import HomeForm from './components/homeForm';

function App() {
  return (
    <div className="app-layout">
        <div className="app-container">
          <Header />
          <div className="app-content">
              <HomeForm />
          </div>
          
        </div>
    </div>
  );
}

export default App;
