import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import Dashboard from './Dashboard';
import Account from "./Account";
import AddProduct from "./AddProduct";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

const queryClient = new QueryClient();

function App() {
  const token = cookies.get("TOKEN");
  
  return (
    <>
      {/*<QueryClientProvider client={queryClient}>*/}
    <Container>
      <Row>
        <Col className="text-center">

          <section id="navigation">
            <a href="/">Home</a>
            <a href="/Dashboard">Dashboard</a>
          </section>
        </Col>
      </Row>
      
    <Router>
      <Routes>
      <Route index path="/" element={<Account />} />
      <Route path="/Dashboard" element={!token ? <Navigate to="/" /> :  <Dashboard />} />
      <Route path="/addProduct" element={!token ? <Navigate to="/" /> : <AddProduct />} />
      </Routes>
    </Router>
      </Container>
      {/*</QueryClientProvider>*/}
    </>
  );
}

export default App;