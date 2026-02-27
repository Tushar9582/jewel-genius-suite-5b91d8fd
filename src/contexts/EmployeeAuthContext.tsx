import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ref, get, query, orderByChild, equalTo, set, remove } from 'firebase/database';
import { db } from '@/lib/firebase';

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
    validateSession();
  }, []);

  const validateSession = async () => {
    const sessionToken = localStorage.getItem(SESSION_KEY);
    if (!sessionToken) {
      setLoading(false);
      return;
    }

    try {
      const sessionRef = ref(db, `employee_sessions/${sessionToken}`);
      const snapshot = await get(sessionRef);
      
      if (!snapshot.exists()) {
        localStorage.removeItem(SESSION_KEY);
        setEmployee(null);
        setLoading(false);
        return;
      }

      const sessionData = snapshot.val();
      if (new Date(sessionData.expires_at) < new Date()) {
        await remove(sessionRef);
        localStorage.removeItem(SESSION_KEY);
        setEmployee(null);
        setLoading(false);
        return;
      }

      // Fetch employee data
      const empRef = ref(db, `employees/${sessionData.employee_id}`);
      const empSnapshot = await get(empRef);
      if (empSnapshot.exists()) {
        setEmployee({ id: sessionData.employee_id, ...empSnapshot.val() });
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
      // Find employee by employee_id
      const employeesRef = ref(db, 'employees');
      const snapshot = await get(employeesRef);
      
      if (!snapshot.exists()) {
        return { error: new Error('No employees found') };
      }

      let foundEmployee: any = null;
      let foundKey: string = '';
      
      snapshot.forEach((child) => {
        const emp = child.val();
        if (emp.employee_id === employeeId) {
          foundEmployee = emp;
          foundKey = child.key!;
        }
      });

      if (!foundEmployee) {
        return { error: new Error('Employee not found') };
      }

      // Simple password check (in production, use proper hashing)
      if (foundEmployee.password_hash !== password) {
        return { error: new Error('Invalid credentials') };
      }

      if (foundEmployee.is_active === false) {
        return { error: new Error('Account is deactivated') };
      }

      // Create session
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await set(ref(db, `employee_sessions/${sessionToken}`), {
        employee_id: foundKey,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      });

      localStorage.setItem(SESSION_KEY, sessionToken);
      setEmployee({
        id: foundKey,
        employee_id: foundEmployee.employee_id,
        name: foundEmployee.name,
        email: foundEmployee.email || null,
        department: foundEmployee.department || null,
      });
      
      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.message || 'Login failed') };
    }
  };

  const signOut = async () => {
    const sessionToken = localStorage.getItem(SESSION_KEY);
    if (sessionToken) {
      try {
        await remove(ref(db, `employee_sessions/${sessionToken}`));
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem(SESSION_KEY);
    setEmployee(null);
  };

  return (
    <EmployeeAuthContext.Provider value={{ employee, loading, signIn, signOut, isAuthenticated: !!employee }}>
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
