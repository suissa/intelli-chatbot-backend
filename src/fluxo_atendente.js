{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "”"
    },
    { "role": "user", "content": "Você tem Dipirona 500 mg?" }
  ],
  "functions": [
    {
      "name": "check_inventory",
      "description": "GET /api/drugs/search?q=… — retorna { success: boolean, data: { medicamento: string, preco: number }, count: number, searchTerm: string, message: string }. Caso count venha 0, você deve responder que não possuímos o remédio no estoque. caso ",
      "parameters": {
        "type": "object",
        "properties": {
          "medicamento": { "type": "string" }
        },
        "required": ["medicamento"]
      }
    },
    {
      "name": "related_products",
      "description": "GET /api/attendances/search-product — busca na LLM produtos relacionados ao medicamento",
      "parameters": {
        "type": "object",
        "properties": {
          "medicamento": { "type": "string" },
          "preco":       { "type": "number" }
        },
        "required": ["medicamento", "preco"]
      }
    }
  ],
  "function_call": "auto"
}
