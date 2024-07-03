import React from 'react';
import VideoUpload from './components/VideoUpload';
import FormDataList from './components/FormData';
import {Route , Routes} from 'react-router-dom';
import Nav from './components/Nav';
import Home from './components/Home';


function App() {
    return (
        <div className="App">
            <Nav/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path="/formresponse" element={<FormDataList/>}/>
                <Route path="/upload" element={<VideoUpload />} />
            </Routes>
        </div>
    );
}

export default App;


// status: 