'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const {User} = require('../models');

exports.authenticateUser = async (req, res, next) => {
    let message;
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

     // If the user's credentials are available...
     if (credentials) {
         const user = await User.findOne({where: {emailAddress: credentials.name}});

         if(user) {
             const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);
            
                if(authenticated) {
                    console.log(`Authentication successful for user: ${user.firstName} ${user.lastName}`);
                req.currentUser = user;
                } else {
                    message = `Authenitcation failure for user: ${user.firstName} ${user.lastName}`;
                }
         } else {
            message = `User not found for user: ${credentials.name}`;
         }
     } else {
        message = 'Auth header not found';
     }

     if (message) {
         console.warn(message);
         res.status(401).json({message: 'Access Denied'});
     } else {
         next();
     }    
};