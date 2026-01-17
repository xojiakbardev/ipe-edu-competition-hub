import api from './config';
import type { School, Class, Region, PaginatedResponse } from '@/types';

export const schoolsApi = {
  // Get all regions
  getRegions: async (): Promise<Region[]> => {
    const response = await api.get('/schools/regions/');
    return response.data;
  },

  // Get all schools
  getSchools: async (region_id?: number): Promise<PaginatedResponse<School>> => {
    const response = await api.get('/schools/', { params: { region_id } });
    return response.data;
  },

  // Get school by ID
  getSchoolById: async (id: number): Promise<School> => {
    const response = await api.get(`/schools/${id}/`);
    return response.data;
  },

  // Get classes for a school
  getClasses: async (school_id: number): Promise<Class[]> => {
    const response = await api.get(`/schools/${school_id}/classes/`);
    return response.data;
  },

  // Get class by ID
  getClassById: async (id: number): Promise<Class> => {
    const response = await api.get(`/schools/classes/${id}/`);
    return response.data;
  },
};

export default schoolsApi;
