import React, {useState, useEffect, useContext} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Context} from '../Context';
import ReactMarkdown from 'react-markdown';


export default function CourseDetail() {

    // const {authenticatedUser} = useContext(Context);
    const context = useContext(Context);
    let history = useNavigate();

    //calling state
    let {id} = useParams() //accessing id in router link 
    const [courses, setCourse] = useState('');
    const [user, setUser] = useState('');

    //obtains the course info from the API 
    useEffect(() => {
        axios.get(`http://localhost:5000/api/courses/${id}`)
            .then(res => {setCourse(res.data);
                         setUser(res.data.User);
                         })
            .catch(err => console.log('Oh no! Something went wrong fetching data', err))
        }, [id])

    //deletes the course based on id
    function deleteCourse(e) { //StackOverflow assistance
        e.preventDefault();
        const authCred = btoa(`${context.authenticatedUser.emailAddress}:${context.authenticatedPassword}`)
        axios.delete(`http://localhost:5000/api/courses/${id}`, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Basic ${authCred}`
            }})
            .then(res => {
                if(res.status === 401){
                    history('/forbidden');
                } else {
                    history('/');
                }
            })
            .catch(err => {
                history('/error');
            });   
    }
    
    return (
        
        <main>
            <div className="actions--bar">
                <div className="wrap">
                {/* only shows buttons if authenticated user and course owner id match */}
                    {context.authenticatedUser && context.authenticatedUser.id === courses.userId ? (
                        <span>
                            <Link className="button" to={`/courses/${courses.id}/update`}>Update Course</Link>
                            <Link className="button" to="/" onClick={deleteCourse} >Delete Course</Link>
                        </span>
                    ) : (null)}
                    <Link className="button button-secondary" to="/">Return to List</Link>
                </div>
            </div>
            
            <div className="wrap">
                <h2>Course Detail</h2>
                <form>
                    <div className="main--flex">
                        <div>
                            <h3 className="course--detail--title">Course</h3>
                            <h4 className="course--name">{courses.title}</h4>
                            <p>By {user.firstName} {user.lastName}</p> 

                            <ReactMarkdown>{courses.description}</ReactMarkdown>
                        </div>
                        <div>
                            <h3 className="course--detail--title">Estimated Time</h3>
                            <p>{courses.estimatedTime}</p>

                            <h3 className="course--detail--title">Materials Needed</h3>
                            <ul className="course--detail--list">
                                <ReactMarkdown>{courses.materialsNeeded}</ReactMarkdown>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
  }
