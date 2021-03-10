import { Formik, Form } from 'formik'
import React, { useState } from 'react'
import { Alert, Button, Spinner } from 'react-bootstrap'
import { Link, RouteComponentProps } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import InputField from '../components/InputField'
import { useChangePasswordMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'

interface RouteParams { id: string }
interface ChangePasswordScreenType extends RouteComponentProps<RouteParams>{}

const ChangePasswordScreen: React.FC<ChangePasswordScreenType> = ({ match, history }) => {
    const [, changePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState('')

    const token = match.params.id
    console.log(token)
    return (
        <FormContainer>
            <Formik
                initialValues={{ newPassword: '' }}
                onSubmit={async (values, { setErrors }) => {
                    console.log(values, setErrors)
                    const response = await changePassword({ newPassword: values.newPassword, token })
                    if(response.data?.changePassword.errors){
                        const errorMap = toErrorMap(response.data.changePassword.errors)
                        if('token' in errorMap){
                            setTokenError(errorMap.token)
                        }
                        setErrors(errorMap)
                    } else if(response.data?.changePassword.user){
                        // worked
                        history.push('/')
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='newPassword'
                            placeholder='New Password'
                            label='New Password'
                            type='password'
                        />
                        {tokenError && 
                            <div className='my-2'>
                                <Alert variant='danger'>{tokenError}</Alert>
                                <div className='d-flex justify-content-end'>
                                    <Link to='/forgot-password'>Click here to get new one</Link>
                                </div>
                            </div>
                        }
                        <Button
                            className='my-2'
                            type='submit'
                            color='primary'
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Spinner className='mr-1' animation='border' size='sm' />} Change Password
                        </Button>
                    </Form>
                )}
            </Formik>
        </FormContainer>
    )
}

export default ChangePasswordScreen
