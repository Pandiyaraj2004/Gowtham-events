/**
 * Cloudinary Media Optimization Utility
 * Generates dynamic Cloudinary URLs with automatic format (f_auto), 
 * automatic quality compression (q_auto), responsive sizing, and cropping.
 */

interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: 'scale' | 'fit' | 'limit' | 'mfit' | 'fill' | 'lfill' | 'pad' | 'lpad' | 'mpad' | 'crop' | 'thumb';
  gravity?: 'center' | 'face' | 'north' | 'south' | 'east' | 'west';
  type?: 'image' | 'video';
}

export const getOptimizedMediaUrl = (
  url: string,
  options: CloudinaryOptions = {}
): string => {
  if (!url) return '';

  // Fallback if not a Cloudinary hosted asset
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  const {
    width,
    height,
    crop = 'fill',
    gravity = 'center',
    type = 'image',
  } = options;

  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/{version}/{public_id}.{extension}
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    const transformations: string[] = ['f_auto', 'q_auto'];

    if (width) {
      transformations.push(`w_${width}`);
    }
    if (height) {
      transformations.push(`h_${height}`);
    }
    if (width || height) {
      transformations.push(`c_${crop}`);
      if (crop === 'fill' || crop === 'thumb') {
        transformations.push(`g_${gravity}`);
      }
    }

    // Dynamic video transcoding/optimization
    if (type === 'video') {
      transformations.push('vc_auto'); // Automatically select best video codec
    }

    const transformStr = transformations.join(',');
    return `${parts[0]}/upload/${transformStr}/${parts[1]}`;
  } catch (error) {
    console.error('Error generating optimized Cloudinary URL:', error);
    return url;
  }
};
export default getOptimizedMediaUrl;
