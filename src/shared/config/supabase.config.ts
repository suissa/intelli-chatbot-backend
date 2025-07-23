export const supabaseConfig = {
  url: 'https://jxcvnpbifzfconntrtrf.supabase.co',
  apiKey: 'sbp_36f5f7521d3d4afad62c5a49f14a4fa37a074975',
  
  // Configurações adicionais
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

export const validateSupabaseConfig = () => {
  console.log('🔍 Validando configuração do Supabase...');
  
  if (!supabaseConfig.url) {
    throw new Error('❌ SUPABASE_URL não configurada');
  }
  
  if (!supabaseConfig.apiKey) {
    throw new Error('❌ SUPABASE_API_KEY não configurada');
  }
  
  if (!supabaseConfig.url.includes('supabase.co')) {
    throw new Error('❌ SUPABASE_URL inválida - deve ser um domínio supabase.co');
  }
  
  if (!supabaseConfig.apiKey.startsWith('sbp_')) {
    throw new Error('❌ SUPABASE_API_KEY inválida - deve começar com "sbp_"');
  }
  
  console.log('✅ Configuração do Supabase válida');
  console.log(`📡 URL: ${supabaseConfig.url}`);
  console.log(`🔑 Key: ${supabaseConfig.apiKey.substring(0, 10)}...`);
  
  return true;
}; 