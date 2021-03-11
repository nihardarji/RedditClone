import React, { InputHTMLAttributes } from 'react'
import { useField } from 'formik'
import { FormControl, FormGroup, FormLabel } from 'react-bootstrap'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
    name: string
    label: string
    textarea?: boolean
}

const InputField: React.FC<InputFieldProps> = ({ label, textarea, size: _, ...props}) => {
    const [field, { error }] = useField(props)
    return (
        <FormGroup>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            {!textarea ? 
            <FormControl
                {...field}
                {...props}
                id={field.name}
                isInvalid={!!error}
                placeholder={props.placeholder}
            /> : 
            <FormControl
                {...field}
                {...props}
                as='textarea'
                rows={3}
                id={field.name}
                isInvalid={!!error}
                placeholder={props.placeholder}
            />
            }
            {error ? <FormControl.Feedback type="invalid">{error}</FormControl.Feedback> : null}
        </FormGroup>
    )
}

export default InputField
