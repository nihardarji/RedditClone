import React from 'react'
import { Button, Spinner } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useRegisterMutation } from '../generated/graphql'
import { Form, Formik } from 'formik'
import InputField from '../components/InputField'
import { toErrorMap } from '../utils/toErrorMap'
import { RouteComponentProps } from 'react-router-dom'

type RegisterScreenProps = RouteComponentProps

const RegisterScreen: React.FC<RegisterScreenProps> = ({ history }) => {

    // Custom hook : graphql-codegen
    const [, register] = useRegisterMutation()

    return (
        <FormContainer>
            <Formik
                initialValues={{ email: '', username: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register({ options: values })
                    if(response.data?.register.errors){
                        setErrors(toErrorMap(response.data.register.errors))
                    } else if(response.data?.register.user){
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
                            name='email'
                            placeholder='Email'
                            label='Email'
                            type='email'
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
                            {isSubmitting && <Spinner className='mr-1' animation='border' size='sm' />} Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </FormContainer>
    )
}

export default RegisterScreen
