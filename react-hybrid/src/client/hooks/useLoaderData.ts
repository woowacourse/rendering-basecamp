import { useEffect, useState } from 'react';
import { PageProps } from '../../router';

export const useLoaderData = <Data>({ params, loader, initialData }: PageProps<Data>) => {
    const [data, setData] = useState<Data | undefined>(initialData);
    const [error, setError] = useState<boolean | null>(null);

    useEffect(() => {
        if (data) return;
        const load = async () => {
            try {
                setData(await loader(params));
            } catch (error) {
                setError(error);
            }
        };
        load();
    }, []);

    return { data, error, isLoading: !data && !error };
};
