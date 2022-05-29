import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

//Components
import { Provider } from './Context';
import Header from './components/Header';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import Error from './components/Error';

import { withContext } from './Context';
import PrivateRoute from './PrivateRoute';

//Components withContext
const HeaderWithContext = withContext(Header);
const CoursesWithContext = withContext(Courses);
const CourseDetailWithContext = withContext(CourseDetail);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignOutWithContext = withContext(UserSignOut);
const NotFoundWithContext = withContext(NotFound);
const ForbiddenWithContext = withContext(Forbidden);
const ErrorWithContext = withContext(Error);



export default function App() { 
  
    return (
      <BrowserRouter>
        <Provider>
          <div className="App">
            <HeaderWithContext />

            <Routes>
              <Route exact path="/" element={<CoursesWithContext />} />
              <Route path="/signin" element={<UserSignInWithContext />} />
              <Route path="/signup" element={<UserSignUpWithContext />} />
              <Route path="/signout" element={<UserSignOutWithContext />} />
              <Route path="/courses/create" element={<PrivateRoute />}><Route path="" element={<CreateCourseWithContext />} /></Route>
              <Route path="/courses/:id/update" element={<PrivateRoute />}><Route path="" element={<UpdateCourseWithContext />} /></Route>
              <Route path="/courses/:id" element={<CourseDetailWithContext />} />
              <Route element={<NotFoundWithContext />} />
              <Route exact path="/forbidden" element={<ForbiddenWithContext />}/>
              <Route exact path="/error" element={<ErrorWithContext />}/>
            </Routes>
          </div>
        </Provider>
      </BrowserRouter>
      );
    
}

