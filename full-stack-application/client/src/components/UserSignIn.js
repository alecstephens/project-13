import React, { useContext, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Context} from '../Context';

export default function UserSignIn() {

    const context = useContext(Context);
    let history = useNavigate() //useNavigate instead of useHistory due to react version

    //state
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    //obtains the user through context/makes sure user already has an account
    const handleSubmit = (e) => {
      e.preventDefault();
      context.actions.signIn(emailAddress, password)
        .then((user) => {
            if (user === null) {
                    return {errors: ['Sign-in was unsuccessful']};
            } else {
                history('/')
            }
        })
        .catch((error) => {
            console.error(error);
            history('/error');
        })
      }
    
      //handles cancel and navigates to the home page when cancel is clicked
    const handleCancel = (e) => { 
        e.preventDefault();
        history('/');
    }


        return (
            <div>
                <main>
                <div className="form--centered">
                    <h2>Sign In</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="emailAddress">Email Address</label>
                        <input id="emailAddress" name="emailAddress" type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} required/>
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <button className="button" type="submit" onClick={handleSubmit}>Sign In</button><button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                    </form>
                    <p>Don't have a user account? Click here to <Link to="/signup">sign up</Link>!</p>
                    
                </div>
            </main>
            </div>
        );
}
