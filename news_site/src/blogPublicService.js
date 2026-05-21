import axios from 'axios';



const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL,
});


export const blogPublicService = {
  getPublishedBlogs: async () => {
    const response = await api.get('/blogs/published');
    return response.data;
  },

  getPublishedBlogById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  getPublishedBlogOnPages: async(pagename) => {
    const response = await api.get(`/blogs/published/pages/${pagename}`);
    return response.data;
  },

  getPublishedBlogOnPagesById: async(pagename, id) => {
    const response = await api.get(`/blogs/published/pages/${pagename}/${id}`);
    return response.data;
  },




  // Content services
  getPublishedContents: async () => {
    const response = await api.get('/contents/published');
    return response.data;
  },

  getPublishedContentById: async (id) => {
    const response = await api.get(`/contents/${id}`);
    return response.data;
  },

  getPublishedContentOnPages: async(pagename) => {
    const response = await api.get(`/contents/published/pages/${pagename}`);
    return response.data;
  },

  getPublishedContentOnPagesById: async(pagename, id) => {
    const response = await api.get(`/contents/published/pages/${pagename}/${id}`);
    return response.data;
  }

};
