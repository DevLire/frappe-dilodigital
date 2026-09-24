export interface User {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  middleName: string;
  gender: string;
  birthDate: Date;
  interest: string;
  location: string;
  time_zone: string;
  bio: string;
  mobile_no: string;
  linkedin: string;
  github: string;
  lastName: string;
  username: string;
  country: string;
  phone: string;
  avatar: string | null;
  roles: string[];
  isActive: boolean;
  lastLogin: Date;
  theme: 'Dark' | 'Light';
}
