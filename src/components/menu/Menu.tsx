import { NavLink } from 'react-router-dom';
// import { forwardRef } from 'react';

import 'bootstrap-icons/font/bootstrap-icons.css';
import './menu.scss';

const Menu = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const setActive = ({ isActive }: { isActive: boolean }) => (isActive ? 'nav-item active-page' : 'nav-item');

    /**========================================================================
     * todo                             TODO
     *
     *   Сделать названия кнопок (страниц), добавить текст к иконкам
     *
     *
     *========================================================================**/

    return (
        <nav className="nav-container">
            <NavLink to="/" className={setActive} id="menu_button_dataset">
                <i className="bi bi-file-earmark-text-fill" id="menu_button_dataset__icon"></i>
                {!isCollapsed && <span>Dataset</span>}
            </NavLink>
            <NavLink to="/training" className={setActive} id="menu_button_training">
                <i className="bi bi-mortarboard-fill" id="menu_button_training__icon"></i>
                {!isCollapsed && <span>Training</span>}
            </NavLink>
            <NavLink to="/evaluation" className={setActive} id="menu_button_evaluation">
                <i className="bi bi-clipboard-check-fill" id="menu_button_evaluation__icon"></i>
                {!isCollapsed && <span>Evaluation</span>}
            </NavLink>
            <NavLink to="/settings" className={setActive} id="menu_button_settings">
                <i className="bi bi-gear-fill" id="menu_button_settings__icon"></i>
                {!isCollapsed && <span>Settings</span>}
            </NavLink>
            <NavLink to="/about" className={setActive} id="menu_button_about">
                <i className="bi bi-info-circle-fill" id="menu_button_about__icon"></i>
                {!isCollapsed && <span>About</span>}
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
