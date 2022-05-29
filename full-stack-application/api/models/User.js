'use strict';
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({

        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A first name is required'
                }, 
                notEmpty: {
                    msg: 'Please provide a first name'
                }
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A last name is required'
                },
                notEmpty: {
                    msg: 'Please provide a last name'
                }
            }
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                msg: 'The email you entered already exists'
            },
            validate: {
                notNull: {
                    msg: 'An email address is required'
                }, 
                isEmail: {
                    msg: 'Please provide an valid email address'
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter a valid password'
                }, 
                notEmpty: {
                    msg: 'Please provide a password'
                }, 
                len: {
                    args: [8, 20], 
                    msg: 'The password should be between 8 and 20 characters in length'
                }, 
                set(val) {
                    if (val === this.password) {
                        const hashedPassword = bcrypt.hashSync(val, 10);
                        this.setDataValue('password', hashedPassword);
                    }
                }
            }

        }, 
       
    }, {sequelize});

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId', 
                allowNull: false,
            },
        });
    };

    return User;
};