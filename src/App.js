
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import { useCookies } from "react-cookie";
import { BrowserRouter , Routes , Route } from "react-router-dom"

const App = () => {
  const [cookies , setCookie, removeCookie ] =useCookies(['user'])
  const authToken =   cookies.AuthToken

  return (
   <BrowserRouter>
     <Routes>
        <Route path="/" element= {<Home />} />
        {authToken && <Route path="/dashboard" element= {<Dashboard />} />}
        {authToken && <Route path="/onboarding" element= {<Onboarding />} />}
        {authToken && <Route path="/explore" element= {<Explore />} />}
     </Routes>
   </BrowserRouter>
  );
}

export default App;
