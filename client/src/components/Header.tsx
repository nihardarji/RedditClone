import React from 'react'
import { Button, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useMeQuery } from '../generated/graphql'

const Header: React.FC<{}> = () => {
    const [{ data, fetching }] = useMeQuery()

    let body = null

    // loading
    if(fetching) {

        // user is not logged in
    } else if(!data?.me){
        body = (
            <>
                <Link to='/login' className='nav-link'>Login</Link>
                <Link to='/register' className='nav-link'>Register</Link>
            </>
        )

        // user is logged in
    } else {
        body = (
            <>
                <Navbar.Text className='mx-3'>{data.me.username}</Navbar.Text>
                <Button className='btn btn-dark nav-link'>Logout</Button>
            </>
        )
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Link to='/' className='navbar-brand'>Reddit Clone</Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ml-auto">
                    {body}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
