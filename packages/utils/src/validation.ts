// 验证规则接口
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
  validator?: (value: any) => boolean | string;
}

// 验证错误接口
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// 验证结果接口
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// 验证单个字段
export const validateField = (value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    // 必填验证
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rule.message || '此字段为必填项';
    }

    // 如果值为空且不是必填，跳过其他验证
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      continue;
    }

    // 最小长度验证
    if (rule.min !== undefined) {
      if (typeof value === 'string' && value.length < rule.min) {
        return rule.message || `最少需要 ${rule.min} 个字符`;
      }
      if (typeof value === 'number' && value < rule.min) {
        return rule.message || `最小值不能小于 ${rule.min}`;
      }
    }

    // 最大长度验证
    if (rule.max !== undefined) {
      if (typeof value === 'string' && value.length > rule.max) {
        return rule.message || `最多只能输入 ${rule.max} 个字符`;
      }
      if (typeof value === 'number' && value > rule.max) {
        return rule.message || `最大值不能大于 ${rule.max}`;
      }
    }

    // 正则表达式验证
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || '格式不正确';
    }

    // 自定义验证器
    if (rule.validator) {
      const result = rule.validator(value);
      if (result !== true) {
        return typeof result === 'string' ? result : '验证失败';
      }
    }
  }

  return null;
};

// 验证表单
export const validateForm = (
  values: Record<string, any>,
  fieldRules: Record<string, ValidationRule[]>
): ValidationResult => {
  const errors: ValidationError[] = [];

  for (const [field, rules] of Object.entries(fieldRules)) {
    const error = validateField(values[field], rules);
    if (error) {
      errors.push({
        field,
        message: error,
        value: values[field],
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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

  minLength: (min: number, message?: string): ValidationRule => ({
    min,
    message: message || `最少需要 ${min} 个字符`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    max,
    message: message || `最多只能输入 ${max} 个字符`,
  }),

  minValue: (min: number, message?: string): ValidationRule => ({
    min,
    message: message || `最小值不能小于 ${min}`,
  }),

  maxValue: (max: number, message?: string): ValidationRule => ({
    max,
    message: message || `最大值不能大于 ${max}`,
  }),
} as const;

// 验证密码强度
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // 长度检查
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('密码至少需要8个字符');
  }

  // 包含数字
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('密码需要包含数字');
  }

  // 包含小写字母
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('密码需要包含小写字母');
  }

  // 包含大写字母
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('密码需要包含大写字母');
  }

  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('密码需要包含特殊字符');
  }

  return {
    isValid: score >= 4,
    score,
    feedback,
  };
};

// 验证文件类型（表单验证用）
export const validateFormFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type);
};

// 验证文件大小（表单验证用）
export const validateFormFileSize = (
  file: File,
  maxSize: number // 以字节为单位
): boolean => {
  return file.size <= maxSize;
}; 