import { User, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { Entity } from '@/types/shop';
import type { OrderCreateFormData } from '../schema/orderCreateSchema';
import { useEntitySearch } from '../hooks/useEntitySearch';

interface ClientInfoSectionProps {
    clients: Entity[];
    selectedClientId?: number;
    register: UseFormRegister<OrderCreateFormData>;
    setValue: UseFormSetValue<OrderCreateFormData>;
    errors: any;
    isSubmitting: boolean;
}

export const ClientInfoSection = ({
    clients,
    selectedClientId,
    register,
    setValue,
    errors,
    isSubmitting,
}: ClientInfoSectionProps) => {
    const { searchTerm, setSearchTerm, searchResults, isSearching } = useEntitySearch(clients);

    const handleEntityChange = (value: string) => {
        const entityId = Number(value);
        setValue('idEntidad', entityId);
        
        // Find the selected entity and populate direccionEnvio with its direccion
        const selectedEntity = clients.find((client) => client.id === entityId);
        if (selectedEntity?.direccion) {
            setValue('direccionEnvio', selectedEntity.direccion);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información de la Entidad
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="searchEntity">Buscar Entidad</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="searchEntity"
                            type="text"
                            placeholder="Buscar por nombre, NIT, correo, dirección..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            disabled={isSubmitting}
                        />
                    </div>
                    {isSearching && (
                        <p className="text-xs text-muted-foreground mt-1">Buscando...</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="idEntidad">Entidad *</Label>
                    <Select
                        value={selectedClientId?.toString()}
                        onValueChange={handleEntityChange}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger id="idEntidad">
                            <SelectValue placeholder="Seleccione una entidad" />
                        </SelectTrigger>
                        <SelectContent>
                            {searchResults.length > 0 ? (
                                searchResults.map((client) => (
                                    <SelectItem key={client.id} value={client.id.toString()}>
                                        {client.nombre} - # {client.nit} - {client.correo} - {client.direccion}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-results" disabled>
                                    No se encontraron resultados
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    {errors.idEntidad && (
                        <p className="text-sm text-red-500 mt-1">{errors.idEntidad.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="direccionEnvio">Dirección de Envío</Label>
                    <Textarea
                        id="direccionEnvio"
                        {...register('direccionEnvio')}
                        placeholder="Dirección completa de envío..."
                        rows={2}
                        disabled={isSubmitting}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
