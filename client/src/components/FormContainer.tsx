import React from 'react'
import { Col, Row } from 'react-bootstrap'

const FormContainer: React.FC = ({ children }) => {
    return (
        <Row className='d-flex justify-content-center my-4'>
            <Col xs={12} md={7}>
                {children}
            </Col>
        </Row>
    )
}

export default FormContainer
