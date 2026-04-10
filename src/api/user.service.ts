import type { ProfileFormData } from '../modules/settings/schemas/profile.schema';
import type { WorkshopFormData } from '../modules/settings/schemas/workshop.schema';
import api from './auth.service';

export const userService = {
  getMe: () => api.get('/users/me').then(res => res.data),
  updateMe: (data: ProfileFormData) => api.patch('/users/me', data).then(res => res.data),
};

export const workshopService = {
  getMyWorkshop: () => api.get('/workshops/my-workshop').then(res => res.data),

  createWorkshop: (data: WorkshopFormData) =>
    api.post('/workshops', data).then(res => res.data),

  updateWorkshop: (id: string, formData: FormData) =>
    api.put(`/workshops/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data),
};
