import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import InputField from '../components/InputField'
import { useForgotPasswordMutation } from '../generated/graphql'

interface ForgotPasswordScreenType {}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenType> = () => {
    const [complete, setComplete] = useState(false)
    const [, forgotPassword] = useForgotPasswordMutation()

    return (
        <FormContainer>
            <Formik
                initialValues={{ email: '' }}
                onSubmit={async (values) => {
                    await forgotPassword(values)
                    setComplete(true)
                }}
            >
                {({ isSubmitting }) => 
                    complete ? (
                        <h4 className='my-4'>
                            If an account with that mail exists, Please check the mailbox to change the password
                        </h4>
                    ) : (
                    <Form>
                        <InputField
                            name='email'
                            placeholder='Email'
                            label='Email'
                            type='email'
                        />
                        <Button
                            className='my-2'
                            type='submit'
                            color='primary'
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Spinner className='mr-1' animation='border' size='sm' />}
                            Forgot Password
                        </Button>
                    </Form>
                )}
            </Formik>
        </FormContainer>
    )
}

export default ForgotPasswordScreen
