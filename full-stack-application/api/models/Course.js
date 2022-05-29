'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false, 
            validate: {
                notNull: {
                    msg: 'Valid course title required'
                }, 
                notEmpty: {
                    msg: 'Please prove a title for the course'
                }
            },
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Valid course description required'
                }, 
                notEmpty: {
                    msg: 'Please provide a description for this course'
                }
            },
        },
        estimatedTime: {
            type: Sequelize.STRING,
        }, 
        materialsNeeded: {
            type: Sequelize.STRING,
        },
    }, {sequelize});

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userId', 
                allowNull: false,
            },
        });
    };

    return Course;
}