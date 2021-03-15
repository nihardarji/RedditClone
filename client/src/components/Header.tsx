import React from 'react'
import { Button, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'

const Header: React.FC<{}> = () => {
    const [, logout] = useLogoutMutation()
    const [{ data, fetching }] = useMeQuery()

    let body = null

    // loading
    if(fetching) {

        //  user is not logged in
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
                <Link to='/create-post' className='btn btn-dark nav-link'>Create Post</Link>
                <Button onClick={() => logout()} className='btn btn-dark nav-link'>Logout</Button>
            </>
        )
    }

    return (
        <Navbar sticky="top" collapseOnSelect expand="sm" bg="dark" variant="dark">
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
