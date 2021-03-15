import { Form, Formik } from 'formik'
import React from 'react'
import { Button, ProgressBar, Spinner } from 'react-bootstrap'
import { RouteComponentProps } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import InputField from '../components/InputField'
import { usePostQuery, useUpdatePostMutation } from '../generated/graphql'

interface RouteParams { id: string }
interface EditPostScreenProps extends RouteComponentProps<RouteParams> {}

const EditPostScreen: React.FC<EditPostScreenProps> = ({ match, history }) => {
    const [, updatePost] = useUpdatePostMutation()

    const intId = typeof match.params.id === 'string' ? parseInt(match.params.id) : -1
    const [{ data, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId
        }
    })

    if(fetching) {
        return <ProgressBar now={100} animated />
    }

    if(!data?.post){
        return (
            <h4>No post found</h4>
        )
    }

    return (
        <>
            <Button variant='secondary' className='my-2' onClick={() => history.goBack()}>Back</Button>
            <FormContainer>
                <Formik
                    initialValues={{ title: data.post.title, text: data.post.text }}
                    onSubmit={async (values) => {
                        await updatePost({ id: intId, ...values})
                        history.goBack()
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
                                Update Post
                            </Button>
                        </Form>
                    )}
                </Formik>
            </FormContainer>
        </>
    )
}

export default EditPostScreen
