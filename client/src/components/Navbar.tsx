import {NavLink} from "react-router-dom";

export default function Navbar() {
  return(
    <div>
      <nav className = "flex justify-between items-center mb-6">
        <NavLink to = "/">
        <img alt = "Logo" 
        className="h-24 inline" 
        src="/ca6342e6-eac1-4f04-ab21-b6e18faccadb.png">
        </img>
        </NavLink>


        </nav>
      </div>
  )
}