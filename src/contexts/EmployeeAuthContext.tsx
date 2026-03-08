import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { auth, db } from '@/lib/firebase';

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

type LocalEmployeeSession = {
  employee_id: string;
  name: string;
  email: string | null;
  department: string | null;
  expires_at: string;
};

export function EmployeeAuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateSession();
  }, []);

  const ensureAuthForEmployeeLookup = async () => {
    if (!auth.currentUser) {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error('Anonymous auth failed:', error);
      }
    }
  };

  const validateSession = async () => {
    const sessionRaw = localStorage.getItem(SESSION_KEY);
    if (!sessionRaw) {
      setLoading(false);
      return;
    }

    try {
      const sessionData = JSON.parse(sessionRaw) as LocalEmployeeSession;

      if (!sessionData.employee_id || !sessionData.expires_at) {
        localStorage.removeItem(SESSION_KEY);
        setEmployee(null);
        setLoading(false);
        return;
      }

      if (new Date(sessionData.expires_at) < new Date()) {
        localStorage.removeItem(SESSION_KEY);
        setEmployee(null);
        setLoading(false);
        return;
      }

      await ensureAuthForEmployeeLookup();

      // Fetch employee data directly
      const empRef = ref(db, `employees/${sessionData.employee_id}`);
      const empSnapshot = await get(empRef);

      if (!empSnapshot.exists()) {
        localStorage.removeItem(SESSION_KEY);
        setEmployee(null);
        setLoading(false);
        return;
      }

      const empData = empSnapshot.val();
      if (empData?.is_active === false) {
        localStorage.removeItem(SESSION_KEY);
        setEmployee(null);
        setLoading(false);
        return;
      }

      setEmployee({
        id: sessionData.employee_id,
        employee_id: empData.employee_id,
        name: empData.name,
        email: empData.email || null,
        department: empData.department || null,
      });
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
      await ensureAuthForEmployeeLookup();

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

      // Store local employee session (24h)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          employee_id: foundKey,
          expires_at: expiresAt.toISOString(),
        } satisfies LocalEmployeeSession)
      );

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
