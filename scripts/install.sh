#!/bin/bash
# Installs the launcher to ~/.local and creates a .desktop entry.
# Run from inside the extracted tarball directory.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -f "$SCRIPT_DIR/bin/01-path-mapping-hardcoded.hook" ]; then
    :
else
    echo "Error: Run this script from inside the extracted launcher directory." >&2
    exit 1
fi

DESKTOP_FILE=$(find "$SCRIPT_DIR" -maxdepth 2 -name "*.desktop" -print -quit 2>/dev/null)
if [ -n "$DESKTOP_FILE" ]; then
    PRODUCT_NAME=$(grep -oP '^Name=\K.*' "$DESKTOP_FILE" | head -1)
fi
PRODUCT_NAME="${PRODUCT_NAME:-SS13 Launcher}"

SLUG=$(echo "$PRODUCT_NAME" | tr '[:upper:] ' '[:lower:]-' | tr -cd 'a-z0-9-')

INSTALL_DIR="$HOME/.local/share/$SLUG"
BIN_DIR="$HOME/.local/bin"
APPS_DIR="$HOME/.local/share/applications"

echo "Installing $PRODUCT_NAME to $INSTALL_DIR..."

if [ -d "$INSTALL_DIR" ]; then
    rm -rf "$INSTALL_DIR"
fi

mkdir -p "$INSTALL_DIR"
cp -a "$SCRIPT_DIR"/. "$INSTALL_DIR/"

chmod +x "$INSTALL_DIR/launch.sh" "$INSTALL_DIR/AppRun"

mkdir -p "$APPS_DIR"

ICON_PATH=""
for candidate in "$INSTALL_DIR/icon.png" "$INSTALL_DIR/share/icons/"*"/apps/"*.png; do
    if [ -f "$candidate" ]; then
        ICON_PATH="$candidate"
        break
    fi
done

cat > "$APPS_DIR/$SLUG.desktop" <<DESKTOP
[Desktop Entry]
Name=$PRODUCT_NAME
Exec=$INSTALL_DIR/launch.sh %u
Icon=${ICON_PATH}
Type=Application
Categories=Game;
Comment=Game launcher for SS13 servers
MimeType=x-scheme-handler/ss13;
Terminal=false
DESKTOP

chmod +x "$APPS_DIR/$SLUG.desktop"

mkdir -p "$BIN_DIR"
ln -sf "$INSTALL_DIR/launch.sh" "$BIN_DIR/$SLUG"

echo "Installed successfully."
echo "- App directory: $INSTALL_DIR"
echo "- Desktop entry: $APPS_DIR/$SLUG.desktop"
echo ""
echo "To uninstall: rm -rf \"$INSTALL_DIR\" \"$APPS_DIR/$SLUG.desktop\" \"$BIN_DIR/$SLUG\""
