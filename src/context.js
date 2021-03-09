import React, { createContext, useState } from "react";

export const Context = createContext({});

const ContextProider = ({ children }) => {
  const [user, setUser] = useState({
    id: "",
    role: "",
    image: "",
    email: "",
    firstname: "",
    lastname: "",
  });
  const setData = (data) => {
    setUser({
      id: data.id,
      role: data.role,
      image: data.image,
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
    });
  };
  return (
    <Context.Provider value={{ user, setData }}>{children}</Context.Provider>
  );
};

export default ContextProider;
