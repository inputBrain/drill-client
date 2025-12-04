"use client";

import {Bounce, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
    return (
        <ToastContainer
            position="bottom-right"
            autoClose={1600}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
        />

    // <ToastContainer
    //         position="bottom-right"
    //         autoClose={1600}
    //         hideProgressBar
    //         pauseOnHover={false}
    //         pauseOnFocusLoss={false}
    //         closeButton={false}
    //         draggable={false}
    //         theme="light"
    //         toastClassName="!rounded-2xl !shadow-2xl !text-sm"
    //     />
    );
}
