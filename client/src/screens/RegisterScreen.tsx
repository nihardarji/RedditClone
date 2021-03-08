import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'

interface registerScreenProps {

}

const RegisterScreen: React.FC<registerScreenProps> = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const submitHandler = (e: React.SyntheticEvent) => {
        e.preventDefault()
        console.log('Register')
    }

    return (
        <FormContainer>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='username'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type='text' 
                        placeholder='Enter username'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password' 
                        placeholder='Enter password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant='primary' type='submit'>
                    Register
                </Button>
            </Form>
        </FormContainer>
    )
}

export default RegisterScreen
