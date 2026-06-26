#!/usr/bin/env bash
# 3LMTO - Pre-Deploy Check Script
# يعمل typecheck + lint + build محلياً قبل الرفع

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "==========================================="
echo "  3LMTO Pre-Deploy Check"
echo "==========================================="
echo ""

# 1. Check Node version
log_info "Checking Node.js version..."
NODE_VERSION=$(node --version)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')
if [ "$NODE_MAJOR" -lt 20 ]; then
    log_error "Node.js >= 20 required. Current: $NODE_VERSION"
    exit 1
fi
log_info "Node.js $NODE_VERSION ✓"

# 2. Check package.json exists
if [ ! -f "package.json" ]; then
    log_error "package.json not found"
    exit 1
fi

# 3. Install dependencies
log_info "Installing dependencies..."
npm ci --prefer-offline --no-audit

# 4. TypeScript type check
log_info "Running TypeScript type check..."
npm run typecheck 2>&1 || {
    log_error "TypeScript check failed. Fix errors above."
    exit 1
}
log_info "TypeScript check passed ✓"

# 5. Lint
log_info "Running ESLint..."
npm run lint 2>&1 || {
    log_error "Lint failed. Fix errors above."
    exit 1
}
log_info "Lint passed ✓"

# 6. Build
log_info "Running Next.js build..."
npm run build 2>&1 || {
    log_error "Build failed. Fix errors above."
    exit 1
}
log_info "Build passed ✓"

# 7. Check .env.example vs actual env (if .env.local exists)
if [ -f ".env.local" ]; then
    log_info "Checking environment variables..."
    # Extract required vars from .env.example
    REQUIRED_VARS=$(grep -E '^[A-Z_]+=' .env.example | cut -d= -f1)
    MISSING=0
    for var in $REQUIRED_VARS; do
        if ! grep -q "^${var}=" .env.local; then
            log_warn "Missing in .env.local: $var"
            MISSING=1
        fi
    done
    if [ $MISSING -eq 0 ]; then
        log_info "Environment variables OK ✓"
    fi
fi

echo ""
echo "==========================================="
echo -e "  ${GREEN}All checks passed! Ready to deploy.${NC}"
echo "==========================================="
echo ""
echo "Next steps:"
echo "  1. Commit changes: git add . && git commit -m 'pre-deploy'"
echo "  2. Push: git push"
echo "  3. Trigger build on Hostinger Dashboard"
echo ""