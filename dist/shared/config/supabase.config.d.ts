export declare const supabaseConfig: {
    url: string;
    apiKey: string;
    options: {
        auth: {
            autoRefreshToken: boolean;
            persistSession: boolean;
            detectSessionInUrl: boolean;
        };
        db: {
            schema: string;
        };
        global: {
            headers: {
                'X-Client-Info': string;
            };
        };
    };
};
export declare const validateSupabaseConfig: () => boolean;
//# sourceMappingURL=supabase.config.d.ts.map