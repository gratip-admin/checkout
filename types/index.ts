// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  error?: any;
  success?: boolean;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  kyc?: {
    status: string;
  };
}

// Auth Types
export interface AuthPayload {
  idToken: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface OtpPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

// KYC Types
export interface KycPayload {
  user_id: string;
}

export interface KycResponse {
  accessToken: string;
  status?: string;
}

// Session Types
export interface Session {
  idToken?: string;
  provider?: string;
  user?: {
    id?: string;
    email?: string;
    image?: string;
  };
}

// React Query Types
export interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => void;
  isPending: boolean;
  data: TData | undefined;
  error: Error | null;
}

// HTTP Types
export interface HttpConfig {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface AxiosConfig {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface HttpError {
  name: string;
  message: string;
  response?: {
    data?: {
      message?: string;
      error?: any;
    };
  };
}

// Component Props Types
export interface UserProviderProps {
  children: React.ReactNode;
}

export interface FormikWrapperProps {
  children: React.ReactNode | ((props: any) => React.ReactNode);
  initialValues: Record<string, any>;
  validationSchema: any;
  onSubmit: (values: any) => void;
  validate?: any;
}

// Utility Types
export interface IconMap {
  [key: string]: React.ComponentType<any>;
}

export interface DownloadCsvParams {
  csv: string;
  filename: string;
}
