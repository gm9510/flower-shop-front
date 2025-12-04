import { useState, useEffect } from 'react';
import { entityService } from '@/services/api/clients';
import type { Entity } from '@/types/shop';

export const useEntitySearch = (initialClients: Entity[]) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Entity[]>(initialClients);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setSearchResults(initialClients);
    }, [initialClients]);

    useEffect(() => {
        const searchEntities = async () => {
            if (searchTerm.trim().length < 2) {
                setSearchResults(initialClients);
                return;
            }

            setIsSearching(true);
            try {
                const results = await entityService.searchEntidades(searchTerm);
                setSearchResults(results);
            } catch (error) {
                console.error('Error searching entities:', error);
                setSearchResults(initialClients);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            searchEntities();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, initialClients]);

    return {
        searchTerm,
        setSearchTerm,
        searchResults,
        isSearching,
    };
};
