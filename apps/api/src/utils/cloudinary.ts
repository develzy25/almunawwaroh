import { Context } from 'hono';

interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

function getConfig(c: Context): CloudinaryConfig | null {
  const cloudName = c.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = c.env.CLOUDINARY_API_KEY;
  const apiSecret = c.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary credentials are not configured in environment variables.');
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

// Generate signature SHA-1 for Cloudinary signed requests
async function generateSignature(params: Record<string, any>, apiSecret: string): Promise<string> {
  const sortedKeys = Object.keys(params).sort();
  const signatureString = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&') + apiSecret;

  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Detect resource type based on publicId or URL
export function getResourceType(publicId: string, secureUrl?: string): 'image' | 'raw' {
  const target = secureUrl || publicId;
  const parts = target.split('.');
  const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : '';
  
  const rawExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar', 'csv'];
  if (ext && rawExtensions.includes(ext)) {
    return 'raw';
  }
  return 'image';
}

/**
 * Upload a file buffer to Cloudinary
 * @param c Hono Context
 * @param fileBuffer Buffer of the file
 * @param folder Target folder in Cloudinary (e.g. 'al-munawwaroh/santri')
 * @param fileName Optional file name prefix
 */
export async function uploadToCloudinary(
  c: Context,
  fileBuffer: ArrayBuffer,
  folder: string,
  fileName?: string
): Promise<{ public_id: string; secure_url: string; bytes: number; width?: number; height?: number } | null> {
  const config = getConfig(c);
  if (!config) return null;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params: Record<string, string> = {
    folder,
    timestamp,
  };

  if (fileName) {
    // Clean up filename to be Cloudinary friendly
    const cleanName = fileName.replace(/[^a-zA-Z0-9-_]/g, '_');
    params.public_id = `${cleanName}_${timestamp}`;
  }

  const signature = await generateSignature(params, config.apiSecret);

  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer]));
  formData.append('api_key', config.apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);
  if (params.public_id) {
    formData.append('public_id', params.public_id);
  }

  // Use 'auto' to let Cloudinary detect resource type (image, video, raw/document)
  const url = `https://api.cloudinary.com/v1_1/${config.cloudName}/auto/upload`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.status} - ${errText}`);
    }

    const data: any = await response.json();
    return {
      public_id: data.public_id,
      secure_url: data.secure_url,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

/**
 * Delete an asset from Cloudinary
 * @param c Hono Context
 * @param publicId Cloudinary public_id
 * @param resourceType 'image' | 'raw'
 */
export async function deleteFromCloudinary(
  c: Context,
  publicId: string,
  resourceType: 'image' | 'raw' = 'image'
): Promise<boolean> {
  const config = getConfig(c);
  if (!config) return false;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = {
    public_id: publicId,
    timestamp,
  };

  const signature = await generateSignature(params, config.apiSecret);

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('api_key', config.apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/destroy`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Cloudinary destroy failed for ${publicId} (${resourceType}): ${response.status} - ${errText}`);
      
      // If resourceType was image, retry once as raw just in case
      if (resourceType === 'image') {
        return deleteFromCloudinary(c, publicId, 'raw');
      }
      return false;
    }

    const data: any = await response.json();
    return data.result === 'ok';
  } catch (error) {
    console.error(`Error deleting from Cloudinary (${publicId}):`, error);
    return false;
  }
}
