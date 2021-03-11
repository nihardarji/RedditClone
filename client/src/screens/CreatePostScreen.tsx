import { Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { RouteComponentProps } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import InputField from '../components/InputField'
import { useCreatePostMutation, useMeQuery } from '../generated/graphql'

interface RouteParams { id: string }
interface CreatePostScreenType extends RouteComponentProps<RouteParams>{}

const CreatePostScreen: React.FC<CreatePostScreenType> = ({ history }) => {
    const [{ data, fetching }] = useMeQuery()
    const [, createPost] = useCreatePostMutation()
    useEffect(() => {
        if(!fetching && !data?.me){
            history.replace('/login')
        }
    }, [data, history, fetching])
    return (
        <FormContainer>
            <Formik
                initialValues={{ title: '', text: '' }}
                onSubmit={async (values) => {
                    const { error } = await createPost({ input: values })
                    if(error?.message.includes('Not Authenticated')){
                        history.replace('/login')
                    } else {
                        history.push('/')
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='title'
                            placeholder='Title'
                            label='Title'
                        />
                        <InputField
                            name='text'
                            placeholder='Enter body...'
                            label='Body'
                            textarea
                        />
                        <Button
                            className='my-2'
                            type='submit'
                            color='primary'
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Spinner className='mr-1' animation='border' size='sm' />}
                            Create Post
                        </Button>
                    </Form>
                )}
            </Formik>
        </FormContainer>
    )
}

export default CreatePostScreen
