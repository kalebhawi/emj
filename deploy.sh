#!/usr/bin/env bash
# Publica o site estatico na hospedagem KingHost via FTP sobre TLS.
#
# Uso:
#   FTP_USER='emjseguranca' FTP_PASS='sua_senha' ./deploy.sh
#
# Opcionais:
#   FTP_HOST  padrao web1171.kinghost.net
#             Atencao: o certificado do servidor e um curinga *.kinghost.net,
#             que cobre apenas um nivel. Nem ftp.web1171.kinghost.net nem
#             ftp.emjseguranca.com.br batem com ele -- por isso o padrao e o
#             nome curto, o unico que permite validar o TLS.
#   FTP_DIR   padrao vazio; o login do FTP ja cai na raiz publica do site.
set -euo pipefail

FTP_HOST="${FTP_HOST:-web1171.kinghost.net}"
FTP_DIR="${FTP_DIR:-}"
: "${FTP_USER:?defina FTP_USER}"
: "${FTP_PASS:?defina FTP_PASS}"

# Credencial vai por arquivo de config, e nao na linha de comando,
# para nao aparecer na lista de processos.
CONF=$(mktemp)
trap 'rm -f "$CONF"' EXIT
umask 077
printf 'user = "%s:%s"\n' "$FTP_USER" "$FTP_PASS" > "$CONF"

# Tudo que esta versionado, menos o que e so de repositorio/ferramenta.
FILES=$(git ls-files --cached --others --exclude-standard | grep -vE '^(README\.md|deploy\.sh)$')

echo "Enviando para ftp://${FTP_HOST}${FTP_DIR}/"
for f in $FILES; do
  printf '  %-32s' "$f"
  curl --silent --show-error --fail \
       --ssl-reqd --ftp-create-dirs \
       --config "$CONF" \
       -T "$f" "ftp://${FTP_HOST}${FTP_DIR}/${f}"
  echo "ok"
done
echo "Concluido."
