import './App.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import RegisterScreen from './screens/RegisterScreen'
import { Container } from 'react-bootstrap'
import MainScreen from './screens/MainScreen'
import LoginScreen from './screens/LoginScreen'
import Header from './components/Header'
import ChangePasswordScreen from './screens/ChangePasswordScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import CreatePostScreen from './screens/CreatePostScreen'

const App = () => {
  return (
    <div>
      <Router>
        <Header />
        <Container>
          <Route component={MainScreen} path='/' exact/>
          <Route component={LoginScreen} path='/login' exact/>
          <Route component={RegisterScreen} path='/register' exact/>
          <Route component={ChangePasswordScreen} path='/change-password/:id' exact/>
          <Route component={ForgotPasswordScreen} path='/forgot-password' exact/>
          <Route component={CreatePostScreen} path='/create-post' exact/>
        </Container>
      </Router>
    </div>
  )
}

export default App
