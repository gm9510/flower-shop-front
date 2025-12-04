import { apiClient } from '@/lib/api';
import type { Entity, EntityCreate, EntityUpdate, Cliente, ClienteCreate } from '@/types/shop';

export const entityService = {
  // Get all entities
  async getEntidades(params?: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<Entity[]> {
    return apiClient.get<Entity[]>('/api/entidades/', params);
  },

  // Create new entity
  async createEntidad(entityData: EntityCreate): Promise<Entity> {
    return apiClient.post<Entity>('/api/entidades/', entityData);
  },

  // Get single entity by ID
  async getEntidad(id: number): Promise<Entity> {
    return apiClient.get<Entity>(`/api/entidades/${id}`);
  },

  // Update entity
  async updateEntidad(id: number, updates: EntityUpdate): Promise<Entity> {
    return apiClient.put<Entity>(`/api/entidades/${id}`, updates);
  },

  // Delete entity
  async deleteEntidad(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/entidades/${id}`);
  },

  // Search entities by any field (nombre, nit, direccion, etc.)
  async searchEntidades(searchTerm: string): Promise<Entity[]> {
    return this.getEntidades({ search: searchTerm });
  },

  // Find entity by correo
  async findByCorreo(correo: string): Promise<Entity | null> {
    const entities = await this.searchEntidades(correo);
    const found = entities.find(e => e.correo.toLowerCase() === correo.toLowerCase());
    return found || null;
  },
};

// Legacy alias for backwards compatibility
export const clientService = {
  getClientes: (params?: { skip?: number; limit?: number; nombre?: string; email?: string }) => {
    const searchParam = params?.nombre || params?.email;
    return entityService.getEntidades({
      skip: params?.skip,
      limit: params?.limit,
      search: searchParam
    });
  },
  createCliente: (data: ClienteCreate) => entityService.createEntidad(data as EntityCreate),
  getCliente: (id: number) => entityService.getEntidad(id),
  updateCliente: (id: number, updates: Partial<ClienteCreate>) => entityService.updateEntidad(id, updates as EntityUpdate),
  deleteCliente: (id: number) => entityService.deleteEntidad(id),
  findByEmail: (email: string) => entityService.findByCorreo(email),
};