import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <div className='p-5'>
        <Outlet />
      </div>
    </>
  )
}

export default App
