import { NavLink } from 'react-router-dom';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { IconGeometry } from '@tabler/icons-react';

import './menu.scss';

const Menu = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const setMasterClasses = ({ isActive, baseClass }: { isActive: boolean; baseClass: string }) => {
        return `menu__button ${baseClass} ${isActive ? 'menu__button--active' : ''} ${
            isCollapsed ? 'menu__button--collapsed' : ''
        }`.trim();
    };

    return (
        <nav className="menu">
            <NavLink
                to="/dataset"
                className={({ isActive }) => setMasterClasses({ isActive, baseClass: 'menu__button--dataset' })}
            >
                <i className="bi bi-file-earmark-text-fill menu__button__icon"></i>
                {!isCollapsed && <span className="menu__button__text">Dataset</span>}
            </NavLink>

            <NavLink
                to="/architecture"
                className={({ isActive }) => setMasterClasses({ isActive, baseClass: 'menu__button--architecture' })}
            >
                {({isActive}) => (
                    <>
                        {/* <i className="bi bi-sliders menu__button__icon"></i> */}
                        <IconGeometry size={isActive ? 28 : 24} />
                        {!isCollapsed && <span className="menu__button__text">Architecture</span>}
                    </>
                )}
            </NavLink>

            <NavLink
                to="/training"
                className={({ isActive }) => setMasterClasses({ isActive, baseClass: 'menu__button--training' })}
            >
                <i className="bi bi-mortarboard-fill menu__button__icon"></i>
                {!isCollapsed && <span className="menu__button__text">Training</span>}
            </NavLink>

            <NavLink
                to="/inference"
                className={({ isActive }) => setMasterClasses({ isActive, baseClass: 'menu__button--inference' })}
            >
                <i className="bi bi-rocket-takeoff-fill menu__button__icon"></i>
                {!isCollapsed && <span className="menu__button__text">Inference</span>}
            </NavLink>

            <NavLink
                to="/preferences"
                className={({ isActive }) => setMasterClasses({ isActive, baseClass: 'menu__button--preferences' })}
            >
                <i className="bi bi-gear-fill menu__button__icon"></i>
                {!isCollapsed && <span className="menu__button__text">Preferences</span>}
            </NavLink>

            <NavLink
                to="/about"
                className={({ isActive }) => setMasterClasses({ isActive, baseClass: 'menu__button--about' })}
            >
                <i className="bi bi-info-circle-fill menu__button__icon"></i>
                {!isCollapsed && <span className="menu__button__text">About</span>}
            </NavLink>
        </nav>
    );
};

export default Menu;

// import { NavLink } from 'react-router-dom';
// // import { forwardRef } from 'react';

// import 'bootstrap-icons/font/bootstrap-icons.css';
// import './menu.scss';

// const Menu = ({ isCollapsed }: { isCollapsed: boolean }) => {
//     const setActive = ({ isActive }: { isActive: boolean }) => (isActive ? 'nav-item active-page' : 'nav-item');

//     /**========================================================================
//      * todo                             TODO
//      *
//      *   Сделать названия кнопок (страниц), добавить текст к иконкам
//      *
//      *
//      *========================================================================**/

//     const menuItems = [
//         { to: '/', icon: 'bi-file-earmark-text-fill', label: 'Dataset' },
//         { to: '/training', icon: 'bi-mortarboard-fill', label: 'Training' },
//         { to: '/evaluation', icon: 'bi-clipboard-check-fill', label: 'Evaluation' },
//         { to: '/settings', icon: 'bi-gear-fill', label: 'Settings' },
//         { to: '/about', icon: 'bi-info-circle-fill', label: 'About' },
//     ];

//     return (
//         <nav className="nav-container">
//             {menuItems.map(({ to, icon, label }) => (
//                 <NavLink key={to} to={to} className={setActive}>
//                     <i className={`bi ${icon}`} />
//                     {!isCollapsed && <span>{label}</span>}
//                 </NavLink>
//             ))}
//         </nav>
//     );
// };

// export default Menu;
