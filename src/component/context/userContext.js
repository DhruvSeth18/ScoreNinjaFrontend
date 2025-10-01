import { createContext, useContext, useState } from "react";

// 1. Create the context
const UserContext = createContext();

// 2. Create the provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// 3. Create a custom hook for easier usage
export const useUser = () => useContext(UserContext);
