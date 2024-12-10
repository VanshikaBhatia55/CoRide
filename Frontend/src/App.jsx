// import { useState } from 'react'
import {RecoilRoot} from "recoil"
import {Routes, Route} from "react-router-dom"
import Home from './pages/Home'
import CreateRide from './pages/CreateRide'
import PageLoader from './pages/PageLoader'
import Profile from './pages/Profile'
import MyRides from './pages/MyRides'
import { CallbackPage } from './pages/Callback'
import { useAuth0 } from '@auth0/auth0-react'
import { AuthenticationGuard } from './components/AuthenticationGuard'
import { useLocation } from 'react-router-dom';
import BulkRides from './pages/BulkRides'

function App() {
  // const [count, setCount] = useState(0);
  const {pathname} = useLocation();
  
  const {isLoading} = useAuth0();
  // console.log(pathname);

  if(isLoading && pathname!="/create-ride"){
    return(
      <div>
        <PageLoader />
      </div>
    )
  }
  // console.log(user);

  return (
    <>
      <RecoilRoot>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/create-ride' element={<CreateRide/>} />
          <Route path='/callback' element={<CallbackPage/>} />
          <Route path='/all-rides' element={<BulkRides/>}/>
          <Route path='/profile' element={<AuthenticationGuard component={Profile} />}/>
          <Route path='/myRides' element={<AuthenticationGuard component={MyRides} />}/>
          <Route path='/*' element={<Home/>} />
        </Routes>
      </RecoilRoot>
    </>
  )
}

export default App
