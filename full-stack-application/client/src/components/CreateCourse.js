import React, { useState, useContext } from 'react'; 
import {useNavigate} from 'react-router-dom';
import {Context} from '../Context';


//function creates a new course in the API
export default function CreateCourse() {

    let history = useNavigate();
    const context = useContext(Context);

    // // creating state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [materialsNeeded, setMaterialsNeeded] = useState('');
    const [errors, setErrors] = useState([]);

//on submit, function creates new course in the api using the POST method 
    async function handleSubmit(e) { //google resource and context reference
        e.preventDefault();
        setErrors([]);
        
        const authCred = btoa(`${context.authenticatedUser.emailAddress}:${context.authenticatedPassword}`);
        const res = await fetch('http://localhost:5000/api/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Basic ${authCred}`, 
                'Accept': 'application/json'
            },
            body: JSON.stringify({ //reference from rapidapi.com
                title: title,
                description: description, 
                estimatedTime: estimatedTime, 
                materialsNeeded: materialsNeeded, 
                userId: context.authenticatedUser.id}),
        })

        if (res.status === 201) {
            history('/'); //directs to home page when course is created to show new course
          } else if (res.status === 401) {
            history('/forbidden')
          } else if (res.status === 400) {
            res.json()
              .then(data => {
                setErrors(data.errors)
              });
          } else {
            throw new Error();
          }
    }

    // directs to home page when cancel is clicked
    const handleCancel = (e) => {
        e.preventDefault();
        history('/');
    }

    const errorHandler = errors.length ?      //stackoverflow help with writing validation logic
    (<div className="validation--errors">
        <h3>Validation Errors</h3>
            <ul>{errors.map((error, i) => {return (<li key={i}>{error}</li>)})}</ul>
    </div>) : null

    return (
        <main>
            <div className="wrap">
                <h2>Create Course</h2>
               {errorHandler}
                <form onSubmit={handleSubmit}>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="courseTitle">Course Title</label>
                            <input id="courseTitle" name="courseTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

                            <p>By {context?.authenticatedUser ? `${context.authenticatedUser.firstName} ${context.authenticatedUser.lastName}` : ''}</p>

                            <label htmlFor="courseDescription">Course Description</label>
                            <textarea id="courseDescription" name="courseDescription" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input id="estimatedTime" name="estimatedTime" type="text" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />

                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea id="materialsNeeded" name="materialsNeeded" value={materialsNeeded} onChange={(e) => setMaterialsNeeded(e.target.value)}></textarea>
                        </div>
                    </div>
                    <button className="button" onClick={handleSubmit}>Create Course</button><button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </main>
    )
}  