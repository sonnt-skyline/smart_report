import { createContext, useState, useContext } from 'react';

// Create a context for user roles
const UserContext = createContext();

// Role types
export const USER_ROLES = {
  MANAGER: 'manager',
  MEMBER: 'member'
};

export function UserProvider({ children }) {
  const [userRole, setUserRole] = useState(USER_ROLES.MANAGER); // Default to manager

  const value = {
    userRole,
    setUserRole,
    isManager: userRole === USER_ROLES.MANAGER,
    isMember: userRole === USER_ROLES.MEMBER
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
