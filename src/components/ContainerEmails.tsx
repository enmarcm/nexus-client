import React, { useState } from "react";
import "./css/ContainerEmails.css";

const ContainerEmails = () => {


    return (
        <div className="container mx-auto bg-white py-4 px-6 rounded-lg shadow-md h-full">
            <div className="w-full flex justify-between">
                <div className="w-2/3">
                    <h2 className="text-lg font-bold mb-4">
                        Emails
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default ContainerEmails;