import { Link } from "react-router-dom";
import '../cssfiles/sal.css'

const Nav = () => {
    return ( 
        <div className="navbarr">
            <nav className="nav">
                <Link to='/'><h1>Home</h1></Link>
                <Link to='/formresponse'>VideoResponses</Link>
                <Link to='/upload'>UploadedVideo</Link>

            </nav>
        </div>
     );
}
 
export default Nav;