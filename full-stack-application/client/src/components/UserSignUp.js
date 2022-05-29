import React, {useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Context} from '../Context';

export default function UserSignUp() {

    const context = useContext(Context);
    const history = useNavigate();

    //declaring state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    
    //sends a get request via context to the API to create new user
    const handleSubmit = (e) => {
        e.preventDefault();
        context.actions.createUser({firstName, lastName, emailAddress, password})
            .then(errors => {
                if (errors.length) {
                    setErrors(errors)
                } else {
                    context.actions.signIn(emailAddress, password)
                        .then(() => {
                            history('/');
                        });
                }
            })
            .catch((err) => {
                console.log(err); 
                history('/error');
            });
    }

    const errorHandler = errors.length ?      //stackoverflow help with writing validation logic
        (<div className="validation--errors">
            <h3>Validation Errors</h3>
                <ul>{errors.map((error, i) => {return (<li key={i}>{error}</li>)})}</ul>
        </div>) : (null) 

    return(
        <main>
            <div className="form--centered">
                <h2>Sign Up</h2>
                {errorHandler}
                <form>
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" name="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <label htmlFor="emailAddress">Email Address</label>
                    <input id="emailAddress" name="emailAddress" type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="button" type="submit" onClick={handleSubmit}>Sign Up</button><Link className="button button-secondary" to="/">Cancel</Link>
                </form>
                <p>Already have a user account? Click here to <Link to="/signin">sign in</Link>!</p>
            </div>
        </main>
    )
}