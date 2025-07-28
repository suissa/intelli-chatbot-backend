#!/bin/bash

# Adiciona tudo
git add .

# Comita se houver algo novo
if ! git diff --cached --quiet; then
  git commit -m "auto: save $(date '+%H:%M:%S')"
  git push
else
  echo "[INFO] Nada para commitar."
fi

echo "[DEBUG] Script rodou às $(date)" >> logs.txt
