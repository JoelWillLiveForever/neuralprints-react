import { useState, useEffect } from "react";

type ScreenSize = {
    width: number;
    height: number;
};

const useScreenSize = (): ScreenSize => {
    const [screenSize, setScreenSize] = useState<ScreenSize>(() => ({
        width: window.innerWidth || 0,
        height: window.innerHeight || 0,
    }));

    useEffect(() => {
        const updateSize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", updateSize);
        updateSize(); // Вызываем сразу, чтобы избежать задержки

        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return screenSize;
};

export default useScreenSize;

// dont work!






// // useScreenSize.ts
// import { useState, useEffect } from 'react';

// const useScreenSize = () => {
//     const [screenSize, setScreenSize] = useState({
//         width: window.innerWidth,
//         height: window.innerHeight,
//     });

//     useEffect(() => {
//         const handleResize = () => {
//             setScreenSize({
//                 width: window.innerWidth,
//                 height: window.innerHeight,
//             });
//         };

//         window.addEventListener('resize', handleResize);

//         // Clean up the event listener when the component unmounts
//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     return screenSize;
// };

// export default useScreenSize;
