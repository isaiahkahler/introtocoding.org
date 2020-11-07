import React from 'react';
import { Link } from 'react-router-dom';

function LandingContainer(props: {}) {
    return (
        // <div>
        //     <h1>WORK IN PROGRESS!</h1>
        //     <h2>this web application is currently construction. </h2>
        //     <Link to='/home'><a><h2>continue...</h2></a></Link>
        // </div>
        <div style={{minHeight: "100vh", minWidth: "100vw", position: "absolute", left: 0, right: 0, top: 0, bottom: 0}}>
            <iframe src="./test.html" width="100%" height="100%" frameBorder={0}>

            </iframe>
        </div>
    );
}

export default LandingContainer;