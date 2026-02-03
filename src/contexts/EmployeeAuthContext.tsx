import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Employee {
  id: string;
  employee_id: string;
  name: string;
  email: string | null;
  department: string | null;
}

interface EmployeeAuthContextType {
  employee: Employee | null;
  loading: boolean;
  signIn: (employeeId: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType | undefined>(undefined);

const SESSION_KEY = 'employee_session_token';

export function EmployeeAuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    validateSession();
  }, []);

  const validateSession = async () => {
    const sessionToken = localStorage.getItem(SESSION_KEY);
    
    if (!sessionToken) {
      setLoading(false);
      return;
    }

    try {
      const url = new URL(import.meta.env.VITE_SUPABASE_URL);
      const response = await fetch(
        `${url.origin}/functions/v1/employee-auth?action=validate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_token: sessionToken }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.valid) {
        localStorage.removeItem(SESSION_KEY);
        setEmployee(null);
      } else {
        setEmployee(data.employee);
      }
    } catch (error) {
      console.error('Session validation error:', error);
      localStorage.removeItem(SESSION_KEY);
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (employeeId: string, password: string) => {
    try {
      const url = new URL(import.meta.env.VITE_SUPABASE_URL);
      const response = await fetch(
        `${url.origin}/functions/v1/employee-auth?action=login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: employeeId, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data?.error || 'Login failed') };
      }

      if (!data?.success) {
        return { error: new Error(data?.error || 'Login failed') };
      }

      localStorage.setItem(SESSION_KEY, data.session_token);
      setEmployee(data.employee);
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return { error: new Error(errorMessage) };
    }
  };

  const signOut = async () => {
    const sessionToken = localStorage.getItem(SESSION_KEY);
    
    if (sessionToken) {
      try {
        const url = new URL(import.meta.env.VITE_SUPABASE_URL);
        await fetch(
          `${url.origin}/functions/v1/employee-auth?action=logout`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_token: sessionToken }),
          }
        );
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    localStorage.removeItem(SESSION_KEY);
    setEmployee(null);
  };

  return (
    <EmployeeAuthContext.Provider value={{ 
      employee, 
      loading, 
      signIn, 
      signOut,
      isAuthenticated: !!employee 
    }}>
      {children}
    </EmployeeAuthContext.Provider>
  );
}

export function useEmployeeAuth() {
  const context = useContext(EmployeeAuthContext);
  if (context === undefined) {
    throw new Error('useEmployeeAuth must be used within an EmployeeAuthProvider');
  }
  return context;
}
