import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import  AppRouter  from './components/AppRouter';

import MyNavbar from "./components/MyNavbar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { Spinner, Container } from "react-bootstrap";
import {check} from "./http/userAPI";

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    check().then(data => {
        user.setUser(true)
        user.setIsAuth(true)
    }).finally(() => setLoading(false))
}, [])

  // if (loading) {
  //   return (
  //     <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
  //       <Spinner animation={"grow"} variant="danger" />
  //     </Container>
  //   );
  // }

  return (
    <BrowserRouter>
      <MyNavbar />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;
