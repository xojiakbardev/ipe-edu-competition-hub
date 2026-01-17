import api from './config';
import type { Event, EventCreate, Prize, PrizeCreate, PaginatedResponse } from '@/types';

export const eventsApi = {
  // Get all events
  getEvents: async (params?: { is_active?: boolean; page?: number; page_size?: number }): Promise<PaginatedResponse<Event>> => {
    const response = await api.get('/events/', { params });
    return response.data;
  },

  // Get event by ID
  getEventById: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}/`);
    return response.data;
  },

  // Create new event
  createEvent: async (data: EventCreate): Promise<Event> => {
    const response = await api.post('/events/', data);
    return response.data;
  },

  // Update event
  updateEvent: async (id: number, data: Partial<EventCreate>): Promise<Event> => {
    const response = await api.patch(`/events/${id}/`, data);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}/`);
  },

  // Get upcoming events for students
  getUpcomingEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events/upcoming/');
    return response.data;
  },

  // --- Prizes ---

  // Get prizes for an event
  getPrizes: async (event_id: number): Promise<Prize[]> => {
    const response = await api.get(`/events/${event_id}/prizes/`);
    return response.data;
  },

  // Create prize
  createPrize: async (data: PrizeCreate): Promise<Prize> => {
    const response = await api.post('/prizes/', data);
    return response.data;
  },

  // Update prize
  updatePrize: async (id: number, data: Partial<PrizeCreate>): Promise<Prize> => {
    const response = await api.patch(`/prizes/${id}/`, data);
    return response.data;
  },

  // Delete prize
  deletePrize: async (id: number): Promise<void> => {
    await api.delete(`/prizes/${id}/`);
  },
};

export default eventsApi;
