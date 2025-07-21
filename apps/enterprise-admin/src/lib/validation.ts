import { z } from 'zod';

// 注册表单验证schema
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, '邮箱不能为空')
    .email('邮箱格式不正确'),
  password: z
    .string()
    .min(8, '密码长度至少8位')
    .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
    .regex(/[a-z]/, '密码必须包含至少一个小写字母')
    .regex(/\d/, '密码必须包含至少一个数字')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '密码必须包含至少一个特殊字符'),
  confirmPassword: z
    .string()
    .min(1, '请确认密码'),
  firstName: z
    .string()
    .min(1, '姓名不能为空')
    .max(50, '姓名长度不能超过50个字符'),
  lastName: z
    .string()
    .min(1, '姓名不能为空')
    .max(50, '姓名长度不能超过50个字符'),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, '请先同意用户协议'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

// 登录表单验证schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '邮箱不能为空')
    .email('邮箱格式不正确'),
  password: z
    .string()
    .min(1, '密码不能为空'),
  rememberMe: z
    .boolean()
    .optional(),
});

// 忘记密码表单验证schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, '邮箱不能为空')
    .email('邮箱格式不正确'),
});

// 重置密码表单验证schema
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, '密码长度至少8位')
    .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
    .regex(/[a-z]/, '密码必须包含至少一个小写字母')
    .regex(/\d/, '密码必须包含至少一个数字')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '密码必须包含至少一个特殊字符'),
  confirmPassword: z
    .string()
    .min(1, '请确认密码'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

// 修改密码表单验证schema
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, '当前密码不能为空'),
  newPassword: z
    .string()
    .min(8, '密码长度至少8位')
    .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
    .regex(/[a-z]/, '密码必须包含至少一个小写字母')
    .regex(/\d/, '密码必须包含至少一个数字')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '密码必须包含至少一个特殊字符'),
  confirmPassword: z
    .string()
    .min(1, '请确认密码'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

// 用户信息更新表单验证schema
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, '姓名不能为空')
    .max(50, '姓名长度不能超过50个字符'),
  lastName: z
    .string()
    .min(1, '姓名不能为空')
    .max(50, '姓名长度不能超过50个字符'),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, '手机号格式不正确')
    .optional()
    .or(z.literal('')),
});

// 导出类型
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>; 