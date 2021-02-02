import React, { createContext, useState } from 'react'

export const userContext = createContext({});

const UserProider = ({ children }) => {
const [dataUser, setDataUser] = useState({ image: '', userName: '', badge: 0 })
    const setData = (data) => {
        setDataUser({data:data})
    }
    return(
        <userContext.Provider value={{dataUser,setData}}>
            {children}
        </userContext.Provider>
    );
}

export default UserProider 