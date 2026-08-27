#!/usr/bin/env bash
# Publica o site estatico na hospedagem KingHost via FTP.
#
# Uso:
#   FTP_USER='usuario' FTP_PASS='senha' ./deploy.sh
#
# Opcionais:
#   FTP_HOST  (padrao: ftp.emjseguranca.com.br)
#   FTP_DIR   (padrao: /www  -- raiz publica do plano KingHost)
set -euo pipefail

FTP_HOST="${FTP_HOST:-ftp.emjseguranca.com.br}"
FTP_DIR="${FTP_DIR:-/www}"
: "${FTP_USER:?defina FTP_USER}"
: "${FTP_PASS:?defina FTP_PASS}"

# Arquivos publicados (tudo que nao seja repositorio/ferramenta)
FILES=$(git ls-files --cached --others --exclude-standard | grep -vE '^(README\.md|deploy\.sh)$')

echo "Enviando para ftp://${FTP_HOST}${FTP_DIR}"
for f in $FILES; do
  printf '  %-40s' "$f"
  curl --silent --show-error --fail \
       --ssl --ftp-create-dirs \
       --user "${FTP_USER}:${FTP_PASS}" \
       -T "$f" "ftp://${FTP_HOST}${FTP_DIR}/${f}"
  echo "ok"
done
echo "Concluido."
