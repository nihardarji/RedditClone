import React from 'react'
import { Button, Spinner } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useLoginMutation } from '../generated/graphql'
import { Form, Formik } from 'formik'
import InputField from '../components/InputField'
import { toErrorMap } from '../utils/toErrorMap'
import { Link, RouteComponentProps } from 'react-router-dom'

type LoginScreenProps = RouteComponentProps

const LoginScreen: React.FC<LoginScreenProps> = ({ history, location }) => {

    // Custom hook : graphql-codegen
    const [, login] = useLoginMutation()

    const next = new URLSearchParams(location.search).get('next')

    return (
        <FormContainer>
            <Formik
                initialValues={{ usernameOrEmail: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values)
                    if(response.data?.login.errors){
                        setErrors(toErrorMap(response.data.login.errors))
                    } else if(response.data?.login.user){
                        // worked
                        if(next){
                            history.push(next)
                        } else {
                            history.push('/')
                        }
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='usernameOrEmail'
                            placeholder='Username or Email'
                            label='Username or Email'
                        />
                        <InputField
                            name='password'
                            placeholder='Password'
                            label='Password'
                            type='password'
                        />
                        <div className='d-flex justify-content-end'>
                            <Link to='/forgot-password'>Forgot Password?</Link>
                        </div>
                        <Button
                            className='my-2'
                            type='submit'
                            color='primary'
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Spinner className='mr-1' animation='border' size='sm' />} Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </FormContainer>
    )
}

export default LoginScreen
