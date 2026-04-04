# =============================================================
# Installation du Stack IA Docker et téléchargement des modèles
# =============================================================

Write-Host "🚀 Démarrage du stack Docker AI (Ollama + LiteLLM + WebUI)..." -ForegroundColor Cyan
docker compose -f docker-compose.ai.yml up -d

Write-Host "✅ Containers démarrés. Attente de l'initialisation de Ollama (10s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "📥 Téléchargement du modèle: llama3.2:3b (Chat général) ~2GB" -ForegroundColor Magenta
docker exec madrassa_ollama ollama pull llama3.2:3b

Write-Host "📥 Téléchargement du modèle: mistral:7b (Raisonnement avancé) ~4.1GB" -ForegroundColor Magenta
docker exec madrassa_ollama ollama pull mistral:7b

Write-Host "📥 Téléchargement du modèle: phi3:mini (Génération rapide) ~2.4GB" -ForegroundColor Magenta
docker exec madrassa_ollama ollama pull phi3:mini

Write-Host "📥 Téléchargement du modèle: nomic-embed-text (Embeddings RAG) ~274MB" -ForegroundColor Magenta
docker exec madrassa_ollama ollama pull nomic-embed-text

Write-Host "🎉 Terminé ! Tous les modèles sont chargés dans l'environnement local." -ForegroundColor Green
Write-Host "ℹ️ Le Proxy LiteLLM est actif sur http://localhost:4001" -ForegroundColor Green
Write-Host "ℹ️ L'interface Open WebUI est sur http://localhost:3001" -ForegroundColor Green
