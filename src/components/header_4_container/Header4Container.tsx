import React from 'react';

/* import interface */
import { Header4ContainerProps } from './Header4ContainerProps';

/* import styles */
import './header_4_container.scss';

const Header4Container: React.FC<Header4ContainerProps> = ({ text }) => {
    return (
        <div className="header-4-container">
            <h6>{text}</h6>
            <div className="header-separator-line"></div>
        </div>
    );
};

export default Header4Container;
