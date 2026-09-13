#!/usr/bin/env bash
set -eo pipefail
umask 077
# PostgreSQL service + .pgpass privé ; dépôt Restic séparé du VPS.
test -n "$PGSERVICE" || { echo "PGSERVICE requis"; exit 2; }
test -n "$RESTIC_REPOSITORY" || { echo "RESTIC_REPOSITORY requis"; exit 2; }
test -n "$RESTIC_PASSWORD_FILE" || { echo "RESTIC_PASSWORD_FILE requis"; exit 2; }
set -u
export PGCONNECT_TIMEOUT=15
backup_root=/var/backups/beyond
install -d -m 700 "$backup_root"
dump=$(mktemp "$backup_root/database.XXXXXX.dump")
trap 'rm -f -- "$dump"' EXIT
pg_dump --format=custom --no-owner --file="$dump"
pg_restore --list "$dump" >/dev/null
restic backup --tag beyond-database "$dump"
# Pas de suppression de sauvegardes avant validation de la durée de conservation.
# La liste lisible de l'archive ne remplace pas un test de restauration.
