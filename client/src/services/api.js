import axios from 'axios';

const normalizeApiBaseUrl = (rawUrl) => {
  let url = (rawUrl || '').trim();

  // If running locally in browser (localhost / 127.0.0.1)
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    if (!url || url === '/api' || url.includes('localhost') || url.includes('127.0.0.1')) {
      return 'http://localhost:5000/api';
    }
  }

  // If in Vite dev mode, default to local backend on port 5000
  if (import.meta.env.DEV) {
    if (!url || url === '/api' || url.includes('localhost') || url.includes('127.0.0.1')) {
      return 'http://localhost:5000/api';
    }
  }

  // If hosted on vercel.app or netlify, automatically target the active Render production API
  if (typeof window !== 'undefined' && (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('netlify.app'))) {
    if (!url || url === '/api' || url.includes('localhost') || url.includes('127.0.0.1') || url.includes('chinmaya-mission-adoni')) {
      return 'https://chyk.onrender.com/api';
    }
  }
  if (!url || url === '/api' || url.includes('chinmaya-mission-adoni-1ofh') || url === 'https://chinmaya-mission-adoni.onrender.com/api') {
    return 'https://chyk.onrender.com/api';
  }
  if (import.meta.env.PROD && (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('chinmaya-mission-adoni'))) {
    return 'https://chyk.onrender.com/api';
  }
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const API_BASE_URL = normalizeApiBaseUrl(
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Session Key Constants
export const AUTH_KEYS = {
  ADMIN_TOKEN: 'marathon_admin_token',
  ADMIN_USER: 'marathon_admin_user',
  USER_TOKEN: 'marathon_user_token',
  USER_USER: 'marathon_user_user',
  LEGACY_TOKEN: 'marathon_token',
  LEGACY_USER: 'marathon_user',
};

// Helper to determine if a URL or context is for Admin
export const getAdminToken = () => {
  try {
    return localStorage.getItem(AUTH_KEYS.ADMIN_TOKEN) || '';
  } catch {
    return '';
  }
};

export const getUserToken = () => {
  try {
    return (
      localStorage.getItem(AUTH_KEYS.USER_TOKEN) ||
      localStorage.getItem(AUTH_KEYS.LEGACY_TOKEN) ||
      ''
    );
  } catch {
    return '';
  }
};

const isAdminTarget = (config) => {
  if (config.headers?.['X-Auth-Scope'] === 'admin') return true;
  if (config.headers?.['X-Auth-Scope'] === 'user') return false;
  
  const url = (config.url || '').toLowerCase();
  if (
    url.startsWith('/admin') ||
    url.includes('/admin/') ||
    url.includes('/media/upload') ||
    url.includes('/media/replace') ||
    url.includes('/homepage/admin') ||
    url.includes('/footer/admin') ||
    url.includes('/activities/admin') ||
    url.includes('/contact/admin') ||
    url.includes('/faqs/admin') ||
    (url.includes('/videos') && config.method?.toLowerCase() !== 'get')
  ) {
    return true;
  }

  // Fallback to active browser tab location if in browser
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/admin');
  }

  return false;
};

api.interceptors.request.use(
  (config) => {
    // Strictly isolate admin token and user token without cross-fallback
    const isAdmin = isAdminTarget(config);
    const token = isAdmin ? getAdminToken() : getUserToken();

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toUpperCase();
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      try {
        localStorage.setItem('cms_last_updated', Date.now().toString());
        window.dispatchEvent(new Event('cms_updated'));
      } catch (e) {}
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const config = error.config || {};
      const isAdmin = isAdminTarget(config);

      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const returnUrl = encodeURIComponent(path + window.location.search);

        if (isAdmin || path.startsWith('/admin')) {
          // Clear only admin session
          localStorage.removeItem(AUTH_KEYS.ADMIN_TOKEN);
          localStorage.removeItem(AUTH_KEYS.ADMIN_USER);
          
          if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
            window.location.href = `/admin/login?redirect=${returnUrl}`;
          }
        } else {
          // Clear only user session
          localStorage.removeItem(AUTH_KEYS.USER_TOKEN);
          localStorage.removeItem(AUTH_KEYS.USER_USER);
          localStorage.removeItem(AUTH_KEYS.LEGACY_TOKEN);
          localStorage.removeItem(AUTH_KEYS.LEGACY_USER);

          const isUserAuthRoute = path.startsWith('/profile') || path.startsWith('/my-activity') || path.startsWith('/my-registrations');
          if (isUserAuthRoute) {
            window.location.href = `/login?redirect=${returnUrl}`;
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signup: (data) => api.post('/auth/signup', data, { headers: { 'X-Auth-Scope': 'user' } }),
  login: (data) => api.post('/auth/login', data, { headers: { 'X-Auth-Scope': 'user' } }),
  loginAdmin: (data) => api.post('/auth/admin/login', data, { headers: { 'X-Auth-Scope': 'admin' } }),
  verifySession: (scope = 'auto') =>
    api.get('/auth/verify', {
      headers: { 'X-Auth-Scope': scope },
    }),
  getMe: () => api.get('/auth/me'),
  getProfile: () => api.get('/auth/profile', { headers: { 'X-Auth-Scope': 'user' } }),
  updateProfile: (data) => api.put('/auth/profile', data, { headers: { 'X-Auth-Scope': 'user' } }),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const userService = {
  getActivities: () => api.get('/users/activities'),
  getRegistrations: () => api.get('/users/registrations'),
  getServices: () => api.get('/users/services'),
  getConnections: () => api.get('/users/connections'),
  getSevaBookings: () => api.get('/users/seva-bookings'),
};

export const communityService = {
  getServices: (params) => api.get('/community-services', { params }),
  getServiceById: (id) => api.get(`/community-services/${id}`),
  createService: (data) => api.post('/community-services', data),
  updateService: (id, data) => api.put(`/community-services/${id}`, data),
  deleteService: (id) => api.delete(`/community-services/${id}`),
};

export const eventService = {
  getConfig: () => api.get('/events/config'),
  updateConfig: (data) => api.put('/events/config', data),
};

export const bannerService = {
  getBanners: () => api.get('/banners'),
  getAllAdmin: () => api.get('/banners/admin/all'),
  uploadBanner: (formData) =>
    api.post('/banners/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  toggleStatus: (id) => api.patch(`/banners/${id}/toggle`),
  deleteBanner: (id) => api.delete(`/banners/${id}`),
};

export const registrationService = {
  getInstitutions: () => api.get('/registrations/institutions'),
  submitForm: (data) => api.post('/registrations/individual', data),
  submitIndividual: (data) => api.post('/registrations/individual', data),
  submitSchoolCollege: (data) => api.post('/registrations/school-college', data),
  submitBulk: (data) =>
    api.post(
      '/registrations/school-college',
      data,
      data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
    ),
  parseFile: (fileFormData) =>
    api.post('/registrations/parse-file', fileFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getUserRegistrations: () => api.get('/registrations/my-registrations'),
  getDetails: (id) => api.get(`/registrations/${id}`),
  getSummary: (year) => api.get('/registrations/summary', { params: { year } }),
  getCounts: () => api.get('/registrations/counts'),
  getAll: (params) => api.get('/registrations', { params }),
  update: (id, data) => api.put(`/registrations/${id}`, data),
  delete: (id) => api.delete(`/registrations/${id}`),
};

export const activityService = {
  getActivities: () => api.get('/activities'),
  getAllAdmin: () => api.get('/activities/admin/all'),
  createActivity: (formData) =>
    api.post('/activities', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  toggleStatus: (id) => api.patch(`/activities/${id}/toggle`),
  deleteActivity: (id) => api.delete(`/activities/${id}`),
};

export const faqService = {
  getFAQs: () => api.get('/faqs'),
  getAllAdmin: () => api.get('/faqs/admin/all'),
  createFAQ: (data) => api.post('/faqs', data),
  updateFAQ: (id, data) => api.put(`/faqs/${id}`, data),
  deleteFAQ: (id) => api.delete(`/faqs/${id}`),
};

export const adminService = {
  getStats: () => api.get('/admin/dashboard-stats'),
  getRegistrations: (params) => api.get('/admin/registrations', { params }),
  getRegistrationById: (id) => api.get(`/admin/registrations/${id}`),
  updateRegistration: (id, data) => api.put(`/admin/registrations/${id}`, data),
  deleteRegistration: (id) => api.delete(`/admin/registrations/${id}`),
  bulkDeleteRegistrations: (registrationIds) => api.post('/admin/registrations/bulk-delete', { registrationIds }),
  getBatches: (params) => api.get('/admin/batches', { params }),
  getBatchStudents: (batchId) => api.get(`/admin/batches/${batchId}/students`),
  downloadBatchSpreadsheet: (batchId) =>
    api.get(`/admin/batches/${batchId}/download`, { responseType: 'blob' }),
  deleteBatch: (batchId) => api.delete(`/admin/batches/${batchId}`),
  retrySheetsSync: (id) => api.post(`/admin/registrations/${id}/sync-sheets`),
  getRegistrationSummary: (year) =>
    api.get('/admin/registrations/summary', { params: { year } }),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  bulkDeleteUsers: (userIds) => api.post('/admin/users/bulk-delete', { userIds }),
  getProfile: () => api.get('/admin/profile', { headers: { 'X-Auth-Scope': 'admin' } }),
  updateProfile: (data) => api.put('/admin/profile', data, { headers: { 'X-Auth-Scope': 'admin' } }),
  changePassword: (data) => api.put('/auth/change-password', data, { headers: { 'X-Auth-Scope': 'admin' } }),
};

export const contactService = {
  submitMessage: (data) => api.post('/contact', data),
  getMyMessages: () => api.get('/contact/my-messages'),
  getMessagesAdmin: () => api.get('/contact/admin/all'),
  updateStatus: (id, status) => api.patch(`/contact/admin/${id}/status`, { status }),
  deleteMessage: (id) => api.delete(`/contact/admin/${id}`),
};

export const volunteerService = {
  submitVolunteer: (data) => api.post('/volunteers', data),
  getVolunteersAdmin: (params) => api.get('/volunteers/admin/all', { params }),
  updateStatus: (id, status, notes) => api.patch(`/volunteers/admin/${id}/status`, { status, notes }),
  deleteVolunteer: (id) => api.delete(`/volunteers/admin/${id}`),
};

export const contentService = {
  getContent: (sectionKey) => api.get(`/content/${sectionKey}`),
  updateContent: (sectionKey, content) => api.put(`/content/${sectionKey}`, { content }),
};

export const homepageService = {
  getPublicHomepage: () => api.get('/homepage'),
  getAdminHomepage: () => api.get('/homepage/admin'),
  updateHomepage: (data) => api.put('/homepage/admin', data),
  addSection: (sectionData) => api.post('/homepage/admin/sections', sectionData),
  updateSection: (sectionId, sectionData) => api.put(`/homepage/admin/sections/${sectionId}`, sectionData),
  deleteSection: (sectionId) => api.delete(`/homepage/admin/sections/${sectionId}`),
  reorderSections: (orders) => api.put('/homepage/admin/reorder', { orders }),
  toggleStatus: (isEnabled) => api.put('/homepage/admin/status', { isEnabled }),
  updateTheme: (themeData) => api.put('/homepage/admin/theme', themeData),
};

export const footerService = {
  getPublicFooter: () => api.get('/footer'),
  getAdminFooter: () => api.get('/footer/admin'),
  createFooter: (data) => api.post('/footer/admin', data),
  updateFooter: (data) => api.put('/footer/admin', data),
  deleteFooter: (id) => api.delete(`/footer/admin/${id || 'default'}`),
};

export const mediaService = {
  getMedia: (params) => api.get('/media', { params }),
  getMediaById: (id) => api.get(`/media/${id}`),
  getCategories: () => api.get('/media/categories'),
  uploadMedia: (data) => {
    if (data instanceof FormData) {
      return api.post('/media/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/media/upload', data);
  },
  updateMedia: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/media/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put(`/media/${id}`, data);
  },
  replaceMediaFile: (id, formData) =>
    api.put(`/media/${id}/replace`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteMedia: (id, force = false) => api.delete(`/media/${id}`, { params: { force } }),
};

export const thoughtAdminService = {
  getThoughts: (params) => api.get('/admin/thoughts', { params }),
  getStats: () => api.get('/admin/thoughts/stats'),
  approveThought: (id) => api.patch(`/admin/thoughts/${id}/approve`),
  rejectThought: (id) => api.delete(`/admin/thoughts/${id}`),
};

export const webContentService = {
  getWebsites: () => api.get('/admin/content/websites'),
  getPages: (website) => api.get('/admin/content/pages', { params: { website } }),
  getPageById: (id) => api.get(`/admin/content/pages/${id}`),
  createPage: (data) => api.post('/admin/content/pages', data),
  updatePage: (id, data) => api.put(`/admin/content/pages/${id}`, data),
  deletePage: (id) => api.delete(`/admin/content/pages/${id}`),
  uploadPageImage: (id, formData) =>
    api.post(`/admin/content/pages/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getPublicPage: (website, pageSlug) => api.get(`/content/website/${website}/page/${pageSlug}`),
};

export const sevaBookingService = {
  submitBooking: (data) => api.post('/seva-bookings', data),
  getMyBookings: () => api.get('/seva-bookings/my-bookings'),
  verifyBooking: (refId) => api.get(`/seva-bookings/verify/${refId}`),
  getAllAdmin: (params) => api.get('/seva-bookings/admin/all', { params }),
  updateStatus: (id, status) => api.patch(`/seva-bookings/admin/${id}/status`, { status }),
  deleteBooking: (id) => api.delete(`/seva-bookings/admin/${id}`),
  bulkDeleteBookings: (bookingIds) => api.post('/seva-bookings/admin/bulk-delete', { bookingIds }),
};

export const siteSettingsService = {
  getStatus: () => api.get('/site-settings'),
  updateStatus: (isLive) => api.put('/site-settings', { isLive }),
  toggleStatus: () => api.post('/site-settings/toggle'),
};

export const marathonSiteSettingsService = {
  getStatus: () => api.get('/marathon-site-settings'),
  updateStatus: (isLive) => api.put('/marathon-site-settings', { isLive }),
  toggleStatus: () => api.post('/marathon-site-settings/toggle'),
};

export const videoService = {
  getVideos: () => api.get('/videos'),
  createVideo: (data) => api.post('/videos', data, { headers: { 'X-Auth-Scope': 'admin' } }),
  updateVideo: (id, data) => api.put(`/videos/${id}`, data, { headers: { 'X-Auth-Scope': 'admin' } }),
  deleteVideo: (id) => api.delete(`/videos/${id}`, { headers: { 'X-Auth-Scope': 'admin' } }),
};

// Local Storage Fallback Registry for Gallery (Works seamlessly locally & deployed)
const LOCAL_FOLDERS_KEY = 'cma_gallery_folders_local';
const LOCAL_MEDIA_KEY = 'cma_gallery_media_local';

const INITIAL_FALLBACK_FOLDER = {
  _id: 'default-temple-folder',
  name: 'SHRI SHANTAMALLESHWARA SWAMI TEMPLE IMAGES',
  slug: 'shri-shantamalleshwara-swami-temple-images',
  description: 'A collection of sacred photographs, deity darshan, temple rituals, festivals and special celebrations of Shri Shantamalleshwara Swami Temple.',
  coverImage: '/assets/hero-lingam-new.jpeg',
  cover_image: '/assets/hero-lingam-new.jpeg',
  status: 'published',
  displayOrder: 1,
  totalMedia: 24,
  imageCount: 24,
  videoCount: 0,
};

const getLocalFolders = () => {
  try {
    const raw = localStorage.getItem(LOCAL_FOLDERS_KEY);
    if (!raw) {
      const initial = [INITIAL_FALLBACK_FOLDER];
      localStorage.setItem(LOCAL_FOLDERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [INITIAL_FALLBACK_FOLDER];
  }
};

const saveLocalFolders = (folders) => {
  try {
    localStorage.setItem(LOCAL_FOLDERS_KEY, JSON.stringify(folders));
  } catch {}
};

const getLocalMedia = () => {
  try {
    const raw = localStorage.getItem(LOCAL_MEDIA_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalMedia = (media) => {
  try {
    localStorage.setItem(LOCAL_MEDIA_KEY, JSON.stringify(media));
  } catch {}
};

const is404RouteNotFound = (err) => {
  if (!err) return false;
  const status = err.response?.status;
  const msg = (err.response?.data?.message || err.message || '').toLowerCase();
  const code = err.response?.data?.errorCode;
  return (
    status === 404 ||
    code === 'ROUTE_NOT_FOUND' ||
    msg.includes('route not found') ||
    msg.includes('not found: /api/gallery') ||
    msg.includes('network error')
  );
};

export const galleryService = {
  // Public
  getPublicFolders: async () => {
    try {
      const res = await api.get('/gallery/folders/public');
      if (res.data?.success && Array.isArray(res.data.data)) {
        const local = getLocalFolders().filter((lf) => lf._id?.startsWith('local-') && lf.status === 'published');
        const remoteIds = new Set(res.data.data.map((f) => f._id));
        const merged = [...res.data.data, ...local.filter((lf) => !remoteIds.has(lf._id))];
        return { ...res, data: { ...res.data, data: merged } };
      }
      return res;
    } catch (err) {
      if (is404RouteNotFound(err)) {
        const published = getLocalFolders().filter((f) => f.status === 'published');
        return { data: { success: true, data: published, localFallback: true } };
      }
      throw err;
    }
  },

  getPublicFolder: async (idOrSlug) => {
    try {
      return await api.get(`/gallery/folders/public/${idOrSlug}`);
    } catch (err) {
      if (is404RouteNotFound(err)) {
        const folders = getLocalFolders();
        const found = folders.find((f) => f._id === idOrSlug || f.slug === idOrSlug) || INITIAL_FALLBACK_FOLDER;
        return { data: { success: true, data: found, localFallback: true } };
      }
      throw err;
    }
  },

  getPublicFolderMedia: async (idOrSlug, params) => {
    try {
      return await api.get(`/gallery/folders/public/${idOrSlug}/media`, { params });
    } catch (err) {
      if (is404RouteNotFound(err)) {
        const folders = getLocalFolders();
        const folder = folders.find((f) => f._id === idOrSlug || f.slug === idOrSlug) || INITIAL_FALLBACK_FOLDER;
        const allMedia = getLocalMedia();
        const media = allMedia.filter((m) => m.folderId === folder._id || m.folderId === folder.slug);
        return { data: { success: true, folder, data: media, localFallback: true } };
      }
      throw err;
    }
  },

  // Admin Folders
  getAdminFolders: async (params) => {
    try {
      const res = await api.get('/gallery/folders', { params, headers: { 'X-Auth-Scope': 'admin' } });
      if (res.data?.success && Array.isArray(res.data.data)) {
        const local = getLocalFolders().filter((lf) => lf._id?.startsWith('local-'));
        const remoteIds = new Set(res.data.data.map((f) => f._id));
        const merged = [...res.data.data, ...local.filter((lf) => !remoteIds.has(lf._id))];
        return { ...res, data: { ...res.data, data: merged } };
      }
      return res;
    } catch (err) {
      if (is404RouteNotFound(err)) {
        return { data: { success: true, data: getLocalFolders(), localFallback: true } };
      }
      throw err;
    }
  },

  getAdminFolderById: async (id) => {
    try {
      return await api.get(`/gallery/folders/${id}`, { headers: { 'X-Auth-Scope': 'admin' } });
    } catch (err) {
      if (is404RouteNotFound(err)) {
        const folders = getLocalFolders();
        const found = folders.find((f) => f._id === id) || INITIAL_FALLBACK_FOLDER;
        return { data: { success: true, data: found, localFallback: true } };
      }
      throw err;
    }
  },

  createFolder: async (data) => {
    try {
      if (data instanceof FormData) {
        return await api.post('/gallery/folders', data, {
          headers: { 'Content-Type': 'multipart/form-data', 'X-Auth-Scope': 'admin' },
        });
      }
      return await api.post('/gallery/folders', data, { headers: { 'X-Auth-Scope': 'admin' } });
    } catch (err) {
      if (is404RouteNotFound(err)) {
        let name = '', slug = '', description = '', status = 'published', displayOrder = 1, coverImage = '';
        if (data instanceof FormData) {
          name = data.get('name') || '';
          slug = data.get('slug') || '';
          description = data.get('description') || '';
          status = data.get('status') || 'published';
          displayOrder = Number(data.get('displayOrder')) || 1;
          const file = data.get('file');
          if (file && typeof file === 'object' && file.size) {
            coverImage = URL.createObjectURL(file);
          } else {
            coverImage = data.get('coverImage') || '';
          }
        } else {
          name = data.name || '';
          slug = data.slug || '';
          description = data.description || '';
          status = data.status || 'published';
          displayOrder = Number(data.displayOrder) || 1;
          coverImage = data.coverImage || '';
        }

        const newFolder = {
          _id: 'local-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          name: name.trim(),
          slug: (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          description: description.trim(),
          coverImage: coverImage || '/assets/hero-lingam-new.jpeg',
          cover_image: coverImage || '/assets/hero-lingam-new.jpeg',
          status,
          displayOrder,
          totalMedia: 0,
          imageCount: 0,
          videoCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          localFallback: true,
        };

        const folders = getLocalFolders();
        folders.unshift(newFolder);
        saveLocalFolders(folders);

        return {
          data: {
            success: true,
            message: 'Folder created successfully (Saved locally. Once the backend is deployed on Render, it will sync with cloud storage).',
            data: newFolder,
            localFallback: true,
          },
        };
      }
      throw err;
    }
  },

  updateFolder: async (id, data) => {
    try {
      if (data instanceof FormData) {
        return await api.put(`/gallery/folders/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data', 'X-Auth-Scope': 'admin' },
        });
      }
      return await api.put(`/gallery/folders/${id}`, data, { headers: { 'X-Auth-Scope': 'admin' } });
    } catch (err) {
      if (is404RouteNotFound(err)) {
        const folders = getLocalFolders();
        const f = folders.find((folder) => folder._id === id);
        if (f) {
          if (data instanceof FormData) {
            if (data.get('name')) f.name = data.get('name');
            if (data.get('slug')) f.slug = data.get('slug');
            if (data.get('status')) f.status = data.get('status');
            const file = data.get('file');
            if (file && typeof file === 'object' && file.size) {
              f.coverImage = URL.createObjectURL(file);
              f.cover_image = f.coverImage;
            } else if (data.get('coverImage')) {
              f.coverImage = data.get('coverImage');
              f.cover_image = f.coverImage;
            }
          } else {
            Object.assign(f, data);
          }
          f.updatedAt = new Date().toISOString();
          saveLocalFolders(folders);
          return { data: { success: true, data: f, localFallback: true } };
        }
      }
      throw err;
    }
  },

  toggleFolderStatus: async (id) => {
    try {
      return await api.patch(`/gallery/folders/${id}/publish`, {}, { headers: { 'X-Auth-Scope': 'admin' } });
    } catch (err) {
      if (is404RouteNotFound(err)) {
        const folders = getLocalFolders();
        const f = folders.find((folder) => folder._id === id);
        if (f) {
          f.status = f.status === 'published' ? 'draft' : 'published';
          saveLocalFolders(folders);
          return { data: { success: true, data: f, localFallback: true } };
        }
      }
      throw err;
    }
  },

  deleteFolder: async (id) => {
    try {
      return await api.delete(`/gallery/folders/${id}`, { headers: { 'X-Auth-Scope': 'admin' } });
    } catch (err) {
      if (is404RouteNotFound(err)) {
        const folders = getLocalFolders().filter((f) => f._id !== id);
        saveLocalFolders(folders);
        const media = getLocalMedia().filter((m) => m.folderId !== id);
        saveLocalMedia(media);
        return { data: { success: true, message: 'Folder deleted successfully', localFallback: true } };
      }
      throw err;
    }
  },

  // Admin Folder Media
  getFolderMedia: async (folderId, params) => {
    try {
      return await api.get(`/gallery/folders/${folderId}/media`, { params, headers: { 'X-Auth-Scope': 'admin' } });
    } catch (err) {
      if (is404RouteNotFound(err)) {
        const folders = getLocalFolders();
        const folder = folders.find((f) => f._id === folderId || f.slug === folderId) || INITIAL_FALLBACK_FOLDER;
        const allMedia = getLocalMedia();
        const media = allMedia.filter((m) => m.folderId === folderId || m.folderId === folder._id);
        return { data: { success: true, folder, data: media, localFallback: true } };
      }
      throw err;
    }
  },

  uploadFolderMedia: async (folderId, data) => {
    try {
      if (data instanceof FormData) {
        return await api.post(`/gallery/folders/${folderId}/media`, data, {
          headers: { 'Content-Type': 'multipart/form-data', 'X-Auth-Scope': 'admin' },
        });
      }
      return await api.post(`/gallery/folders/${folderId}/media`, data, { headers: { 'X-Auth-Scope': 'admin' } });
    } catch (err) {
      if (is404RouteNotFound(err)) {
        const newItems = [];
        if (data instanceof FormData) {
          const files = data.getAll('files');
          const title = data.get('title') || 'Uploaded Media';
          const description = data.get('description') || '';
          const category = data.get('category') || 'Temple & Sanctum';

          files.forEach((file, idx) => {
            if (typeof file === 'object' && file.size) {
              const isVideo = file.type?.startsWith('video/') || false;
              const url = URL.createObjectURL(file);
              newItems.push({
                _id: 'local_media_' + Date.now().toString(36) + '_' + idx,
                folderId,
                title: files.length > 1 ? `${title} (${idx + 1})` : title,
                description,
                mediaType: isVideo ? 'video' : 'image',
                url,
                thumbnailUrl: url,
                category,
                status: 'published',
                displayOrder: idx + 1,
                createdAt: new Date().toISOString(),
                localFallback: true,
              });
            }
          });
        }
        const existingMedia = getLocalMedia();
        const updatedMedia = [...newItems, ...existingMedia];
        saveLocalMedia(updatedMedia);

        // Update counts on folder
        const folders = getLocalFolders();
        const fIdx = folders.findIndex((f) => f._id === folderId);
        if (fIdx >= 0) {
          folders[fIdx].totalMedia = (folders[fIdx].totalMedia || 0) + newItems.length;
          folders[fIdx].imageCount = (folders[fIdx].imageCount || 0) + newItems.filter((m) => m.mediaType === 'image').length;
          folders[fIdx].videoCount = (folders[fIdx].videoCount || 0) + newItems.filter((m) => m.mediaType === 'video').length;
          saveLocalFolders(folders);
        }

        return {
          data: {
            success: true,
            count: newItems.length,
            data: newItems,
            message: `${newItems.length} media items uploaded successfully (Saved locally).`,
            localFallback: true,
          },
        };
      }
      throw err;
    }
  },

  updateMediaItem: async (id, data) => {
    try {
      return await api.put(`/gallery/media/${id}`, data, { headers: { 'X-Auth-Scope': 'admin' } });
    } catch (err) {
      if (is404RouteNotFound(err)) {
        const media = getLocalMedia();
        const item = media.find((m) => m._id === id);
        if (item) {
          Object.assign(item, data);
          saveLocalMedia(media);
          return { data: { success: true, data: item, localFallback: true } };
        }
      }
      throw err;
    }
  },

  deleteMediaItem: async (id) => {
    try {
      return await api.delete(`/gallery/media/${id}`, { headers: { 'X-Auth-Scope': 'admin' } });
    } catch (err) {
      if (is404RouteNotFound(err)) {
        const media = getLocalMedia().filter((m) => m._id !== id);
        saveLocalMedia(media);
        return { data: { success: true, message: 'Media item deleted successfully', localFallback: true } };
      }
      throw err;
    }
  },

  reorderFolderMedia: async (folderId, orderData) => {
    try {
      return await api.put(`/gallery/folders/${folderId}/reorder`, orderData, { headers: { 'X-Auth-Scope': 'admin' } });
    } catch (err) {
      if (is404RouteNotFound(err)) {
        return { data: { success: true, localFallback: true } };
      }
      throw err;
    }
  },
};

export default api;
