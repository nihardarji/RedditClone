import './App.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import RegisterScreen from './screens/RegisterScreen'
import { Container } from 'react-bootstrap'
import MainScreen from './screens/MainScreen'

const App = () => {
  return (
    <div>
      <Router>
        <Container>
          <Route component={MainScreen} path='/' exact/>
          <Route component={RegisterScreen} path='/register' exact/>
        </Container>
      </Router>
    </div>
  )
}

export default App
