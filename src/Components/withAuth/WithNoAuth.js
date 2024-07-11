import React, {useContext} from 'react'
import { AuthContext } from '../../store/Context'
import {Navigate} from 'react-router-dom'

function WithNoAuth (Component) {
    const UnAuthenticatedComponent = (props) => {
        
        const {user} = useContext(AuthContext)
        
        return user ? <Navigate to="/" /> : <Component {...props} />
    }

    return UnAuthenticatedComponent;
}

export default WithNoAuth;