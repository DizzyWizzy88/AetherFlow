import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login'; // 🛠️ Double-check your path relative to App.jsx
import Dashboard from './components/Dashboard'; // Make sure this exists!

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;