"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSupabaseConfig = exports.supabaseConfig = void 0;
exports.supabaseConfig = {
    url: 'https://jxcvnpbifzfconntrtrf.supabase.co',
    apiKey: 'sbp_36f5f7521d3d4afad62c5a49f14a4fa37a074975',
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        db: {
            schema: 'public'
        },
        global: {
            headers: {
                'X-Client-Info': 'fastify-atendimento-api'
            }
        }
    }
};
const validateSupabaseConfig = () => {
    console.log('🔍 Validando configuração do Supabase...');
    if (!exports.supabaseConfig.url) {
        throw new Error('❌ SUPABASE_URL não configurada');
    }
    if (!exports.supabaseConfig.apiKey) {
        throw new Error('❌ SUPABASE_API_KEY não configurada');
    }
    if (!exports.supabaseConfig.url.includes('supabase.co')) {
        throw new Error('❌ SUPABASE_URL inválida - deve ser um domínio supabase.co');
    }
    if (!exports.supabaseConfig.apiKey.startsWith('sbp_')) {
        throw new Error('❌ SUPABASE_API_KEY inválida - deve começar com "sbp_"');
    }
    console.log('✅ Configuração do Supabase válida');
    console.log(`📡 URL: ${exports.supabaseConfig.url}`);
    console.log(`🔑 Key: ${exports.supabaseConfig.apiKey.substring(0, 10)}...`);
    return true;
};
exports.validateSupabaseConfig = validateSupabaseConfig;
//# sourceMappingURL=supabase.config.js.map