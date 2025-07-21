// 文件上传工具函数

// 文件类型枚举
export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other',
}

// 文件信息接口
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  fileType: FileType;
}

// 上传进度回调
export interface UploadProgressCallback {
  (progress: number): void;
}

// 上传结果接口
export interface UploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

// 获取文件类型
export const getFileType = (file: File): FileType => {
  const type = file.type.toLowerCase();

  if (type.startsWith('image/')) {
    return FileType.IMAGE;
  }

  if (type.startsWith('video/')) {
    return FileType.VIDEO;
  }

  if (type.startsWith('audio/')) {
    return FileType.AUDIO;
  }

  if (type.includes('document') ||
    type.includes('pdf') ||
    type.includes('text') ||
    type.includes('application/')) {
    return FileType.DOCUMENT;
  }

  return FileType.OTHER;
};

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 验证文件类型
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type);
};

// 验证文件大小
export const validateFileSize = (
  file: File,
  maxSize: number // 以字节为单位
): boolean => {
  return file.size <= maxSize;
};

// 获取文件扩展名
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// 生成唯一文件名
export const generateUniqueFilename = (
  originalName: string,
  prefix?: string
): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = getFileExtension(originalName);
  const name = originalName.replace(`.${extension}`, '');

  return `${prefix || ''}${name}_${timestamp}_${random}.${extension}`;
};

// 压缩图片
export const compressImage = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('文件不是图片类型'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 计算新的尺寸
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // 绘制图片
      ctx?.drawImage(img, 0, 0, width, height);

      // 转换为 Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('图片压缩失败'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };

    img.src = URL.createObjectURL(file);
  });
};

// 上传文件到 Supabase Storage
export const uploadToSupabase = async (
  file: File,
  bucket: string,
  path: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> => {
  try {
    // 这里需要实际的 Supabase 客户端
    // 暂时返回模拟结果
    if (onProgress) {
      // 模拟上传进度
      for (let i = 0; i <= 100; i += 10) {
        setTimeout(() => onProgress(i), i * 10);
      }
    }

    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      url: `https://example.com/${bucket}/${path}/${file.name}`,
      filename: file.name,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '上传失败',
    };
  }
};

// 删除文件
export const deleteFile = async (
  bucket: string,
  path: string
): Promise<boolean> => {
  try {
    // 这里需要实际的 Supabase 客户端
    // 暂时返回模拟结果
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('删除文件失败:', error);
    return false;
  }
};

// 获取文件预览 URL
export const getFilePreviewUrl = (
  bucket: string,
  path: string
): string => {
  return `https://example.com/${bucket}/${path}`;
};

// 检查文件是否为图片
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

// 检查文件是否为视频
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

// 检查文件是否为音频
export const isAudioFile = (file: File): boolean => {
  return file.type.startsWith('audio/');
};

// 检查文件是否为文档
export const isDocumentFile = (file: File): boolean => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ];
  return documentTypes.includes(file.type);
}; 