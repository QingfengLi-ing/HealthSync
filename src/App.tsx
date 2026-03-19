import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Trends from './pages/Trends';
import Activities from './pages/Activities';
import Suggestions from './pages/Suggestions';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="trends" element={<Trends />} />
        <Route path="activities" element={<Activities />} />
        <Route path="suggestions" element={<Suggestions />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;