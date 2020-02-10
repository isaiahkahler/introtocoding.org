import React from 'react';
import { Link } from 'react-router-dom';

function LandingContainer(props: {}) {
    return (
        <div>
            <h1>WORK IN PROGRESS!</h1>
            <h2>this web application is currently construction. </h2>
            <Link to='/home'><a><h2>continue...</h2></a></Link>
        </div>
    );
}

export default LandingContainer;