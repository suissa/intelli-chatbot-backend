const fs = require('fs');
const path = require('path');
const postgres = require('postgres');
const { parse } = require('csv-parse');
require('dotenv').config();

const sql = postgres({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'pharmai',
  ssl: false
});

async function criarTabela() {
  await sql`
    CREATE TABLE IF NOT EXISTS remedios (
      id SERIAL PRIMARY KEY,
      cod_barra TEXT,
      nome TEXT NOT NULL,
      preco REAL,
      estoque INTEGER
    )
  `;
}

async function importarCSV() {
  const csvPath = path.join(__dirname, 'remedios.csv');

  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      delimiter: ',',
      from_line: 2, // pula cabeçalho
      relax_quotes: true,
      skip_empty_lines: true,
      trim: true
    })
  );

  for await (const row of parser) {
    const [cod_barra, nome, precoStr, estoqueStr] = row;

    const preco = parseFloat(
      precoStr.replace(/["R$\s]/g, '').replace(',', '.')
    );

    const estoque = parseInt(estoqueStr);

    if (isNaN(preco) || isNaN(estoque)) {
      console.warn('⚠️ Ignorando linha inválida:', row.join(','));
      continue;
    }

    try {
      await sql`
        INSERT INTO remedios (cod_barra, nome, preco, estoque)
        VALUES (${cod_barra || "0"}, ${nome}, ${preco}, ${estoque})
      `;
    } catch (err) {
      console.error('❌ Erro ao inserir linha:', row.join(','), '\n→', err.message);
    }
  }

  console.log('✅ Importação CSV → PostgreSQL concluída!');
  await sql.end();
}

(async () => {
  console.log('🚀 Conectando e importando...');
  await criarTabela();
  await importarCSV();
})();
