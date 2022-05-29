const express = require('express');
const {User, Course} = require('./models');
const {authenticateUser} = require('./middleware/auth-user');



//Router instance
const router = express.Router();


//handler function to wrap each route/middleware
function asyncHandler(cb){
    return async(req, res, next) => {
        try{
            await cb(req, res, next)
        } catch (err) {
            res.status(500).send(err);
            next(err);
        }
    }
}

//User Routes//
//Route that will GET all properties and values from current user with 200 status code
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({  //resource - workshop
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        id: user.id
    });
}));

//Route that will POST or create new user, set location, and return 201 status code with no content
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.status(201).location('/').end();
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
}));


//Courses Routes//
//Route that will GET all courses with associated user and 200 status code
router.get('/courses', asyncHandler(async(req, res) => {
    const courses = await Course.findAll({      //API reference website
        attributes: {exclude: ['createdAt', 'updatedAt']}, //SlackOverFlow
        
        include: [{
            model: User,
            attributes: ['firstName', 'lastName', 'emailAddress'] 
            }] 
    });
    if (courses) {
        res.status(200).json(courses);
    } else {
        res.status(404).render('error');
    }
    
}));

//Route that will GET corresponding course with associated user and 200 status code
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        attributes: {exclude: ['createdAt', 'updatedAt']}, //SlackOverFlow
        
        include: [{
            model: User, 
            attributes: ['firstName', 'lastName', 'emailAddress']
        }]
    });
    res.status(200).json(course);
}));

//Route that will POST or create new course, loaction header in URL, and 201 status code
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.location(`/courses/${course.id}`).status(201).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
          } else {
            throw error;
            }
    }
}));

//Route that will PUT or update course and return 204 status code
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => { 
    try{
        const course = await Course.findByPk(req.params.id);
        if (course) {
            if(course.userId === req.currentUser.id){
                await course.update(req.body);
                res.status(204).end();
            } else {
                res.status(403).json({message: 'Users can only make changes if they created the course'});
            }
        }
    } catch(error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
            } else {
                throw error;
            }
    }  
}));

//Route that will DELETE course and return 204 status code
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            if (course.userId === req.currentUser.id) {
                await course.destroy(course);
                res.status(204).end();
            } else {
                res.status(403).json({message: 'Users can only make changes if they created the course'});
            }
        }
    } catch(err){
        res.status(500).json({err})
    }
}));

module.exports = router;