import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authorApi } from '../api/authorApi';

const initialState = {
  authors: {},
  currentAuthor: null,
  loading: false,
  error: null,
};

export const useAuthorStore = create(
  devtools(
    (set, get) => ({
      ...initialState,

      // Actions
      fetchAuthorByName: async (name) => {
        set({ loading: true, error: null });
        
        try {
          const response = await authorApi.getAuthorByName(name);
          
          if (response.success && response.data) {
            const author = response.data;

            
            // Ensure all fields have default values
            const authorWithDefaults = {
              ...author,
              name: author.name || name || 'Unknown Author',
              socialLinks: author.socialLinks || { twitter: '', linkedin: '' },
              title: author.title || 'MATV Staff',
              category: author.category || 'BUSINESS',
              bio: author.bio || `${author.name || name || 'Unknown Author'} is a reporter on the MATV news team.`,
              avatar: author.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
              articles: author.articles || []
            };
            
            set({ 
              currentAuthor: authorWithDefaults,
              authors: { ...get().authors, [author._id]: authorWithDefaults },
              loading: false 
            });
          } else {
            console.log('Failed to fetch author:', response.error);
            
            // Create a default author object when API fails
            const defaultAuthor = {
              name: name || 'Unknown Author',
              socialLinks: { twitter: '', linkedin: '' },
              title: 'MATV Staff',
              category: 'BUSINESS',
              bio: `${name || 'Unknown Author'} is a reporter on the MATV news team.`,
              avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
              articles: []
            };
            
            set({ 
              currentAuthor: defaultAuthor,
              error: response.error || 'Failed to fetch author', 
              loading: false 
            });
          }
        } catch (error) {
          console.error('Error fetching author:', error);
          
          // Create a default author object when API fails
          const defaultAuthor = {
            name: name || 'Unknown Author',
            socialLinks: { twitter: '', linkedin: '' },
            title: 'MATV Staff',
            category: 'BUSINESS',
            bio: `${name || 'Unknown Author'} is a reporter on the MATV news team.`,
            avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
            articles: []
          };
          
          set({ 
            currentAuthor: defaultAuthor,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            loading: false 
          });
        }
      },

      fetchAuthorById: async (id) => {
        set({ loading: true, error: null });
        
        try {
          const response = await authorApi.getAuthorById(id);
          
          if (response.success && response.data) {
            const author = response.data;
            set({ 
              currentAuthor: author,
              authors: { ...get().authors, [author._id]: author },
              loading: false 
            });
          } else {
            set({ error: response.error || 'Failed to fetch author', loading: false });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            loading: false 
          });
        }
      },

      fetchAuthorArticles: async (authorId, page = 1) => {
        try {
          const response = await authorApi.getAuthorArticles(authorId, { page, limit: 10 });
          
          if (response.success && response.data) {
            const { content, socialLinks } = response.data;
            const currentAuthor = get().currentAuthor;
            
            console.log('API response:', response.data);
            console.log('Social links from API:', socialLinks);
            
            if (currentAuthor && currentAuthor._id === authorId) {
              // Always update the social links, title and category from the API response
              const updatedAuthor = {
                ...currentAuthor,
                articles: page === 1 ? content : [...(currentAuthor.articles || []), ...content],
                socialLinks: socialLinks || currentAuthor.socialLinks,
                title: response.data.title || currentAuthor.title || 'MATV Staff',
                category: response.data.category || currentAuthor.category || 'BUSINESS'
              };
              
              console.log('Updated author with social links:', updatedAuthor);
              set({ currentAuthor: updatedAuthor });
            }
          }
        } catch (error) {
          console.error('Failed to fetch author articles:', error);
        }
      },

      followAuthor: async (authorId) => {
        try {
          const response = await authorApi.followAuthor(authorId);
          
          if (response.success) {
            const currentAuthor = get().currentAuthor;
            if (currentAuthor && currentAuthor._id === authorId) {
              set({
                currentAuthor: {
                  ...currentAuthor,
                  followersCount: currentAuthor.followersCount + 1
                }
              });
            }
          }
        } catch (error) {
          console.error('Failed to follow author:', error);
        }
      },

      unfollowAuthor: async (authorId) => {
        try {
          const response = await authorApi.unfollowAuthor(authorId);
          
          if (response.success) {
            const currentAuthor = get().currentAuthor;
            if (currentAuthor && currentAuthor._id === authorId) {
              set({
                currentAuthor: {
                  ...currentAuthor,
                  followersCount: Math.max(0, currentAuthor.followersCount - 1)
                }
              });
            }
          }
        } catch (error) {
          console.error('Failed to unfollow author:', error);
        }
      },

      // State setters
      setCurrentAuthor: (author) => set({ currentAuthor: author }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'author-store',
    }
  )
);