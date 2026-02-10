# Script pour creer les tables Prisma sur Supabase (connexion directe obligatoire).
# A lancer depuis la racine du projet : .\prisma-push-direct.ps1

$directUrl = "postgresql://postgres.qnkjgxctpaxsawcgzemr:Flogaka1508@db.qnkjgxctpaxsawcgzemr.supabase.co:5432/postgres"
$env:DATABASE_URL = $directUrl
npx prisma db push
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
