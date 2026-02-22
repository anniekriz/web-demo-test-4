#!/bin/sh
set -e

MEDIA_DIR="/app/media"
SEED_MEDIA_DIR="/app/media-default"

mkdir -p "$MEDIA_DIR"

if [ -d "$SEED_MEDIA_DIR" ] && [ -z "$(ls -A "$MEDIA_DIR")" ]; then
  cp -a "$SEED_MEDIA_DIR"/. "$MEDIA_DIR"/
fi

exec "$@"
