import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {Context} from '../Context';

export default function Header() {

    const context = useContext(Context);
    
    return (
        <header>
            <div className="wrap header--flex">
                <h1 className="header--logo"><Link to="/">Courses</Link></h1>
                <nav>
                {/*Header authentication. Treehouse authentication workshop*/}
                    {context.authenticatedUser ? (
                        <ul className="header--signedin">
                            <li>Welcome, {context.authenticatedUser.firstName} {context.authenticatedUser.lastName}!</li>
                            <li><Link to="/signout">Sign Out</Link></li>
                        </ul>
                    ) : (
                        <React.Fragment>
                            <ul className="header--signedout">
                                <li><Link to="/signup">Sign Up</Link></li>
                                <li><Link to="/signin">Sign In</Link></li>
                            </ul>
                        </React.Fragment>
                    )}
                </nav>
            </div>
        </header>
    );
}

