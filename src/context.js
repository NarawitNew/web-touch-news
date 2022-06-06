import React, { createContext, useState } from 'react'

export const Context = createContext({});

const ContextProider = ({ children }) => {
    const [user, setUser] = useState({ image: '', email:'', firstname: '', lastname:''})
    const setData = (data) => {
        // console.log('context_data', data.image)
        setUser({
            image: data.image,
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
        })
    }
    return (
        <Context.Provider value={{user,setData}}>
            {children}
        </Context.Provider>
    );
}

export default ContextProider 