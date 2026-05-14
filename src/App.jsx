import Login from './components/Login'; 

function App() {
  return (
    /* h-full ensures the App wrapper passes the 100vh height down to Login */
    <div className="h-full w-full">
      <Login /> 
    </div>
  );
}

export default App;