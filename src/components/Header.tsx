import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>Job Tracker</h1>
            <p>For Unity C# Developers</p>
          </div>
          <nav className="nav">
            <ul>
              <li>
                <NavLink to="/" end>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/applications">
                  Applications
                </NavLink>
              </li>
              <li>
                <NavLink to="/applications/new">
                  Add New
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
