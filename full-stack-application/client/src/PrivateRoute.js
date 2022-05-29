import React, {useContext} from 'react';
import {Outlet, Navigate} from 'react-router-dom';
import {Context} from './Context';

export default function PrivateRoute() {
    //Grab the authenticated user off of the context
    let { authenticatedUser } = useContext(Context);

    //if there is an authenticated user render the outlet
    //otherwise redirect the user to the '/signin' route
    return authenticatedUser ? <Outlet /> : <Navigate to="/signin" />;
}