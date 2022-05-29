import React, {useState, useEffect, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Context} from '../Context';
import axios from 'axios';

export default function UpdateCourse() { //external resource
    
    const context = useContext(Context);
    let history = useNavigate();

    let {id} = useParams()

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [materialsNeeded, setMaterialsNeeded] = useState('');
    const [errors, setErrors] = useState([]);

//function updates course in the API database
    async function updateCourse(e) { //google resource and context reference
        e.preventDefault();
        setErrors([]);
        const authCred = btoa(`${context.authenticatedUser.emailAddress}:${context.authenticatedPassword}`)
        const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Basic ${authCred}`
            },
            body: JSON.stringify({
                title,
                description,
                estimatedTime,
                materialsNeeded}),
        });

        if (res.status === 204) { //thrown in the put method in api
            history('/');
          } else if (res.status === 403) {
            history('/forbidden');
          } else if (res.status === 400) {
            res.json()
              .then(data => {
                setErrors(data.errors)
                console.log(data);
              });
          } else {
            throw new Error();
          }
    }

//retrieves the course from the database that user wishes to update based on id
    useEffect(() => {
        axios.get(`http://localhost:5000/api/courses/${id}`)
            .then (res => {
                setTitle(res.data.title);
                setDescription(res.data.description);
                setEstimatedTime(res.data.estimatedTime);
                setMaterialsNeeded(res.data.materialsNeeded);
                })
            .catch(err => {console.log('Oh no! Something went wrong fetching data', err);})
            }, [id]);


const handleCancel = (e) => {
    e.preventDefault();
    history(`/courses/${id}`);
 }

 const errorHandler = errors.length ?   //stackoverflow help with writing validation logic
 (<div className="validation--errors">
     <h3>Validation Errors</h3>
         <ul>{errors.map((error, i) => {return (<li key={i}>{error}</li>)})}</ul>
 </div>) : (null) 

    return(
        <main>
            <div className="wrap">
                <h2>Update Course</h2>
                {errorHandler}
                <form>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="courseTitle">Course Title</label>
                            <input id="courseTitle" name="courseTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

                            <p>By {context?.authenticatedUser ? `${context.authenticatedUser.firstName} ${context.authenticatedUser.lastName}` : ''}</p>

                            <label htmlFor="courseDescription">Course Description</label>
                            <textarea id="courseDescription" name="courseDescription" value={description} onChange={(e) => setDescription(e.target.value)}>{description}</textarea>
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input id="estimatedTime" name="estimatedTime" type="text" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />

                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea id="materialsNeeded" name="materialsNeeded" value={materialsNeeded} onChange={(e) => setMaterialsNeeded(e.target.value)}>{materialsNeeded}</textarea>
                        </div>
                    </div>
                    <button className="button" type="submit" onClick={updateCourse}>Update Course</button><button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </main>
    )
}


