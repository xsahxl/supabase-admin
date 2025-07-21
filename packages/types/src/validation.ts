// 表单验证规则
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
  validator?: (value: any) => boolean | string;
}

// 表单字段配置
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'file' | 'date';
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: { label: string; value: any }[];
  disabled?: boolean;
  hidden?: boolean;
}

// 表单配置
export interface FormConfig {
  fields: FormField[];
  submitText?: string;
  cancelText?: string;
  layout?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
}

// 表单状态
export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// 表单事件
export interface FormEvents {
  onSubmit?: (values: Record<string, any>) => void;
  onChange?: (name: string, value: any) => void;
  onBlur?: (name: string) => void;
  onFocus?: (name: string) => void;
  onCancel?: () => void;
}

// 验证错误
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// 验证结果
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// 常用验证规则
export const ValidationRules = {
  required: (message = '此字段为必填项'): ValidationRule => ({
    required: true,
    message,
  }),

  email: (message = '请输入有效的邮箱地址'): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message,
  }),

  phone: (message = '请输入有效的手机号码'): ValidationRule => ({
    pattern: /^1[3-9]\d{9}$/,
    message,
  }),

  password: (message = '密码至少包含8个字符'): ValidationRule => ({
    min: 8,
    message,
  }),

  url: (message = '请输入有效的URL地址'): ValidationRule => ({
    pattern: /^https?:\/\/.+/,
    message,
  }),

  number: (message = '请输入有效的数字'): ValidationRule => ({
    pattern: /^\d+$/,
    message,
  }),
} as const; 