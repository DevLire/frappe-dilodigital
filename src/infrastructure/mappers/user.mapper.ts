import type { UserResponse } from '../interfaces/frappe-user.response';
import type { User } from '../core/user.interface';

export class UserMapper {
  static frappeToEntity(userRes: UserResponse): User {
    const { data } = userRes;
    const toText = (value: string | null | undefined): string => value ?? '';

    return {
      id: toText(data.name),
      email: toText(data.email),
      fullName: toText(data.full_name),
      firstName: toText(data.first_name),
      middleName: toText(data.middle_name),
      gender: toText(data.gender),
      birthDate: new Date(data.birth_date),
      interest: toText(data.interest),
      location: toText(data.location),
      time_zone: toText(data.time_zone),
      bio: toText(data.bio),
      mobile_no: toText(data.mobile_no),
      linkedin: toText(data.linkedin),
      github: toText(data.github),
      lastName: toText(data.last_name),
      username: toText(data.username),
      country: toText(data.country),
      phone: toText(data.phone),
      avatar: toText(data.user_image),
      roles: data.roles.map((r) => r.role || '').filter((role) => role !== ''),
      isActive: data.enabled === 1,
      lastLogin: new Date(data.last_login),
      theme: data.desk_theme === 'Dark' ? 'Dark' : 'Light',
    };
  }
}
