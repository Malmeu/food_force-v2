#!/bin/bash

# Script pour activer le mode production dans tous les fichiers
echo "Activation du mode production dans l'application Food Force..."

# Recherche de tous les fichiers JavaScript dans le répertoire client/src
find ./client/src -type f -name "*.js" | while read file; do
  # Vérifie si le fichier contient le commentaire "En production, décommentez le code ci-dessous"
  if grep -q "En production, décommentez le code ci-dessous" "$file"; then
    echo "Traitement du fichier: $file"
    
    # Utilise sed pour décommenter les blocs de code de production
    # 1. Supprime la ligne avec le commentaire "En production, décommentez le code ci-dessous"
    # 2. Supprime les lignes avec /* et */ qui entourent le code de production
    # 3. Supprime les blocs de code qui commencent par "// Simulation pour le développement" jusqu'à la ligne vide suivante
    sed -i '' -e '/\/\/ En production, décommentez le code ci-dessous/d' \
             -e '/\/\*/d' \
             -e '/\*\//d' \
             -e '/\/\/ Simulation pour le développement/,/^$/d' \
             -e '/const mock/,/^$/d' "$file"
  fi
done

echo "Activation du mode production terminée !"
echo "N'oubliez pas de redémarrer l'application pour appliquer les changements."
