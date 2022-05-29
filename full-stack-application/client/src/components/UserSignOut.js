import React, {useEffect, useContext} from 'react';
import { Navigate } from 'react-router-dom';
import {Context} from '../Context';

//removes the authenticated user and password from global state

export default function UserSignOut () {

  const context = useContext(Context);

  useEffect(() => context.actions.signOut())

  return (
    <Navigate to="/" />
  );
}