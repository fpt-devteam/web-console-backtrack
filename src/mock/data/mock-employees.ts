/**
 * Mock data for Employee Management
 */

export type EmployeeRole = 'Admin' | 'Manager' | 'Editor' | 'Viewer';
export type EmployeeStatus = 'Active' | 'Invited' | 'Disabled';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  created: string;
  lastLogin: string | null;
  avatar?: string;
}

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@company.com',
    role: 'Admin',
    status: 'Active',
    created: 'Oct 24, 2023',
    lastLogin: '2 hours ago',
    avatar: 'AS',
  },
  {
    id: '2',
    name: 'Bob Jones',
    email: 'bob@company.com',
    role: 'Manager',
    status: 'Invited',
    created: 'Nov 01, 2023',
    lastLogin: null,
    avatar: 'BJ',
  },
  {
    id: '3',
    name: 'Charlie Day',
    email: 'charlie@company.com',
    role: 'Editor',
    status: 'Disabled',
    created: 'Aug 15, 2023',
    lastLogin: '1 month ago',
    avatar: 'CD',
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana@company.com',
    role: 'Viewer',
    status: 'Active',
    created: 'Sep 10, 2023',
    lastLogin: 'Yesterday',
    avatar: 'DP',
  },
  {
    id: '5',
    name: 'Edward Norton',
    email: 'edward@company.com',
    role: 'Manager',
    status: 'Active',
    created: 'Jul 22, 2023',
    lastLogin: '5 hours ago',
    avatar: 'EN',
  },
  {
    id: '6',
    name: 'Fiona Green',
    email: 'fiona@company.com',
    role: 'Editor',
    status: 'Active',
    created: 'Sep 30, 2023',
    lastLogin: 'Today',
    avatar: 'FG',
  },
  {
    id: '7',
    name: 'George Miller',
    email: 'george@company.com',
    role: 'Viewer',
    status: 'Invited',
    created: 'Nov 15, 2023',
    lastLogin: null,
    avatar: 'GM',
  },
  {
    id: '8',
    name: 'Hannah Lee',
    email: 'hannah@company.com',
    role: 'Admin',
    status: 'Active',
    created: 'Jun 10, 2023',
    lastLogin: '1 hour ago',
    avatar: 'HL',
  },
  {
    id: '9',
    name: 'Ian Wright',
    email: 'ian@company.com',
    role: 'Manager',
    status: 'Disabled',
    created: 'May 05, 2023',
    lastLogin: '2 months ago',
    avatar: 'IW',
  },
  {
    id: '10',
    name: 'Julia Roberts',
    email: 'julia@company.com',
    role: 'Editor',
    status: 'Active',
    created: 'Oct 01, 2023',
    lastLogin: 'Yesterday',
    avatar: 'JR',
  },
  {
    id: '11',
    name: 'Kevin Hart',
    email: 'kevin@company.com',
    role: 'Viewer',
    status: 'Active',
    created: 'Aug 20, 2023',
    lastLogin: '3 days ago',
    avatar: 'KH',
  },
  {
    id: '12',
    name: 'Laura Palmer',
    email: 'laura@company.com',
    role: 'Manager',
    status: 'Invited',
    created: 'Nov 20, 2023',
    lastLogin: null,
    avatar: 'LP',
  },
];

export const getEmployeesPage = (page: number = 1, pageSize: number = 10) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: mockEmployees.slice(start, end),
    total: mockEmployees.length,
    page,
    pageSize,
  };
};

