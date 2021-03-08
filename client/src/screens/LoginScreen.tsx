import React from 'react'
import { Button, Spinner } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useLoginMutation } from '../generated/graphql'
import { Form, Formik } from 'formik'
import InputField from '../components/InputField'
import { toErrorMap } from '../utils/toErrorMap'
import { RouteComponentProps } from 'react-router-dom'

type LoginScreenProps = RouteComponentProps

const LoginScreen: React.FC<LoginScreenProps> = ({ history }) => {

    // Custom hook : graphql-codegen
    const [, login] = useLoginMutation()

    return (
        <FormContainer>
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login({ options: values })
                    if(response.data?.login.errors){
                        setErrors(toErrorMap(response.data.login.errors))
                    } else if(response.data?.login.user){
                        // worked
                        history.push('/')
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='username'
                            placeholder='Username'
                            label='Username'
                        />
                        <InputField
                            name='password'
                            placeholder='Password'
                            label='Password'
                            type='password'
                        />
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
