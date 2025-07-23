-- Script para criar a tabela de remédios
-- Execute este script no seu banco PostgreSQL

CREATE TABLE IF NOT EXISTS remedios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    principio_ativo VARCHAR(255),
    laboratorio VARCHAR(255),
    categoria VARCHAR(100),
    forma_farmaceutica VARCHAR(100),
    concentracao VARCHAR(100),
    apresentacao VARCHAR(255),
    preco DECIMAL(10,2),
    estoque INTEGER DEFAULT 0,
    data_validade DATE,
    ativo BOOLEAN DEFAULT true,
    receita_obrigatoria BOOLEAN DEFAULT false,
    contraindicacoes TEXT,
    efeitos_colaterais TEXT,
    posologia TEXT,
    interacoes_medicamentosas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_remedios_nome ON remedios(nome);
CREATE INDEX IF NOT EXISTS idx_remedios_categoria ON remedios(categoria);
CREATE INDEX IF NOT EXISTS idx_remedios_laboratorio ON remedios(laboratorio);
CREATE INDEX IF NOT EXISTS idx_remedios_ativo ON remedios(ativo);
CREATE INDEX IF NOT EXISTS idx_remedios_estoque ON remedios(estoque);
CREATE INDEX IF NOT EXISTS idx_remedios_data_validade ON remedios(data_validade);

-- Inserir alguns dados de exemplo
INSERT INTO remedios (nome, principio_ativo, laboratorio, categoria, forma_farmaceutica, concentracao, apresentacao, preco, estoque, data_validade, ativo, receita_obrigatoria) VALUES
('Paracetamol', 'Paracetamol', 'EMS', 'Analgésico', 'Comprimido', '750mg', 'Caixa com 20 comprimidos', 8.50, 100, '2025-12-31', true, false),
('Dipirona', 'Dipirona Sódica', 'Neo Química', 'Analgésico', 'Comprimido', '500mg', 'Caixa com 10 comprimidos', 5.20, 150, '2025-10-15', true, false),
('Ibuprofeno', 'Ibuprofeno', 'Medley', 'Anti-inflamatório', 'Comprimido', '600mg', 'Caixa com 12 comprimidos', 12.80, 80, '2025-08-20', true, false),
('Omeprazol', 'Omeprazol', 'Aché', 'Protetor Gástrico', 'Cápsula', '20mg', 'Caixa com 14 cápsulas', 25.90, 60, '2025-06-30', true, false),
('Loratadina', 'Loratadina', 'EMS', 'Antialérgico', 'Comprimido', '10mg', 'Caixa com 10 comprimidos', 15.40, 90, '2025-11-25', true, false),
('Vitamina C', 'Ácido Ascórbico', 'Neo Química', 'Vitaminas', 'Comprimido', '500mg', 'Frasco com 30 comprimidos', 18.70, 120, '2025-09-10', true, false),
('Dorflex', 'Dipirona + Orfenadrina', 'Sanofi', 'Relaxante Muscular', 'Comprimido', '300mg + 35mg', 'Caixa com 10 comprimidos', 22.50, 70, '2025-07-15', true, false),
('Buscopan', 'Butilescopolamina', 'Boehringer', 'Antiespasmódico', 'Comprimido', '10mg', 'Caixa com 20 comprimidos', 28.90, 45, '2025-12-05', true, false),
('Neosaldina', 'Dipirona + Cafeína + Mucato de Isometepteno', 'Cosmed', 'Analgésico', 'Comprimido', '250mg + 30mg + 30mg', 'Caixa com 10 comprimidos', 16.80, 85, '2025-10-30', true, false),
('Tylenol', 'Paracetamol', 'Johnson & Johnson', 'Analgésico', 'Comprimido', '750mg', 'Caixa com 20 comprimidos', 14.90, 95, '2025-11-20', true, false);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_remedios_updated_at 
    BEFORE UPDATE ON remedios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 