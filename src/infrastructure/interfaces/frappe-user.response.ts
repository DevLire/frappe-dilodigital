export interface UserResponse {
  data: Data;
}

export interface Data {
  name: string;
  owner: Owner;
  creation: Date;
  modified: Date;
  modified_by: string;
  docstatus: number;
  idx: number;
  enabled: number;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  username: string;
  country: string;
  verify_terms: number;
  language: string;
  time_zone: string;
  user_category: string;
  send_welcome_email: number;
  unsubscribed: number;
  user_image: string;
  gender: string;
  birth_date: Date;
  interest: string;
  looking_for_job: number;
  phone: string;
  location: string;
  bio: string;
  mobile_no: string;
  linkedin: string;
  github: string;
  hide_private: number;
  attire: string;
  collaboration: string;
  role: string;
  location_preference: string;
  time: string;
  company_type: string;
  mute_sounds: number;
  desk_theme: string;
  search_bar: number;
  notifications: number;
  list_sidebar: number;
  bulk_actions: number;
  view_switcher: number;
  form_sidebar: number;
  timeline: number;
  dashboard: number;
  new_password: string;
  logout_all_sessions: number;
  document_follow_notify: number;
  document_follow_frequency: string;
  follow_created_documents: number;
  follow_commented_documents: number;
  follow_liked_documents: number;
  follow_assigned_documents: number;
  follow_shared_documents: number;
  thread_notify: number;
  send_me_a_copy: number;
  allowed_in_mentions: number;
  simultaneous_sessions: number;
  last_ip: string;
  login_after: number;
  user_type: string;
  last_active: Date;
  login_before: number;
  bypass_restrict_ip_check_if_2fa_enabled: number;
  last_login: Date;
  last_known_versions: string;
  api_key: string;
  api_secret: string;
  onboarding_status: string;
  doctype: Type;
  work_experience: any[];
  defaults: any[];
  internship: any[];
  preferred_industries: any[];
  skill: any[];
  block_modules: any[];
  certification: any[];
  user_emails: any[];
  preferred_functions: any[];
  education: any[];
  roles: Role[];
  social_logins: Role[];
}

export type Type = 'User';

export type Owner = 'Administrator';

export interface Role {
  name: string;
  owner: Owner;
  creation: Date;
  modified: Date;
  modified_by: string;
  docstatus: number;
  idx: number;
  role?: string;
  parent: string;
  parentfield: Parentfield;
  parenttype: Type;
  doctype: Doctype;
  provider?: string;
  userid?: string;
}

export type Doctype = 'Has Role' | 'User Social Login';

export type Parentfield = 'roles' | 'social_logins';
