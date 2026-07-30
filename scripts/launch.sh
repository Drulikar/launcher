#!/bin/bash
# Launch script for SS13 Launcher (sharun portable format)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

export APPDIR="$SCRIPT_DIR"

export WEBKIT_DISABLE_DMABUF_RENDERER="${WEBKIT_DISABLE_DMABUF_RENDERER:-1}"

# Create path compatibility symlink for x86_64-linux-gnu
if [ ! -e "$SCRIPT_DIR/lib/x86_64-linux-gnu" ]; then
    ln -sf . "$SCRIPT_DIR/lib/x86_64-linux-gnu"
fi

if [ -f "$SCRIPT_DIR/bin/01-path-mapping-hardcoded.hook" ]; then
    _tmp_lib=$(grep '_tmp_lib=' "$SCRIPT_DIR/bin/01-path-mapping-hardcoded.hook" | cut -d'=' -f2 | tr -d '"')
    if [ -n "$_tmp_lib" ]; then
        mkdir -p "$SCRIPT_DIR/tmp"
        if [ ! -e "$SCRIPT_DIR/tmp/$_tmp_lib" ]; then
            ln -sf "$SCRIPT_DIR/lib" "$SCRIPT_DIR/tmp/$_tmp_lib"
        fi
    fi
fi

exec "$SCRIPT_DIR/AppRun" "$@"
