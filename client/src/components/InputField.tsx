import React, { InputHTMLAttributes } from 'react'
import { useField } from 'formik'
import { FormControl, FormGroup, FormLabel } from 'react-bootstrap'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string
    label: string
}

const InputField: React.FC<InputFieldProps> = ({ label, size: _, ...props}) => {
    const [field, { error }] = useField(props)
    return (
        <FormGroup>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <FormControl
                {...field}
                {...props}
                id={field.name}
                isInvalid={!!error}
                placeholder={props.placeholder}
            />
            {error ? <FormControl.Feedback type="invalid">{error}</FormControl.Feedback> : null}
        </FormGroup>
    )
}

export default InputField
