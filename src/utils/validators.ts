export const required = (msg?: string) => {
    return (value: any) => {
        if (value === undefined || value === null || Number.isNaN(value) || value === '')
            return msg || 'Required value';
        return undefined;
    }
};