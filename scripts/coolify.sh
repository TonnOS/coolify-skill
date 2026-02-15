#!/bin/bash
# Coolify API Helper Script
# Usage: ./coolify.sh <command> [args]

set -e

# Check dependencies
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed"
    echo "Install with: apt-get install jq (Debian/Ubuntu) or brew install jq (macOS)"
    exit 1
fi

# Load environment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"

# Load .env from skill directory if exists
if [ -f "$SKILL_DIR/.env" ]; then
  set -a
  source "$SKILL_DIR/.env"
  set +a
fi

# Fallback to environment variables
COOLIFY_URL="${COOLIFY_URL:-}"
COOLIFY_TOKEN="${COOLIFY_TOKEN:-}"

if [ -z "$COOLIFY_URL" ] || [ -z "$COOLIFY_TOKEN" ]; then
  echo "Error: COOLIFY_URL and COOLIFY_TOKEN must be set"
  echo "Create .env file in skill directory or export environment variables"
  exit 1
fi

API_BASE="${COOLIFY_URL}/api/v1"

# Helper function for API calls
api_get() {
  curl -s -H "Authorization: Bearer ${COOLIFY_TOKEN}" "${API_BASE}$1"
}

api_post() {
  curl -s -X POST -H "Authorization: Bearer ${COOLIFY_TOKEN}" \
    -H "Content-Type: application/json" "${API_BASE}$1" "${@:2}"
}

# Commands
cmd_health() {
  curl -s "${COOLIFY_URL}/api/v1/health" | jq
}

cmd_version() {
  api_get "/version" | jq
}

cmd_servers() {
  api_get "/servers" | jq
}

cmd_server() {
  [ -z "$1" ] && { echo "Usage: $0 server <uuid>"; exit 1; }
  api_get "/servers/$1" | jq
}

cmd_apps() {
  api_get "/applications" | jq
}

cmd_app() {
  [ -z "$1" ] && { echo "Usage: $0 app <uuid>"; exit 1; }
  api_get "/applications/$1" | jq
}

cmd_deploy() {
  [ -z "$1" ] && { echo "Usage: $0 deploy <app-uuid>"; exit 1; }
  api_post "/applications/$1/start" | jq
}

cmd_restart() {
  [ -z "$1" ] && { echo "Usage: $0 restart <app-uuid>"; exit 1; }
  api_post "/applications/$1/restart" | jq
}

cmd_stop() {
  [ -z "$1" ] && { echo "Usage: $0 stop <app-uuid>"; exit 1; }
  api_post "/applications/$1/stop" | jq
}

cmd_logs() {
  [ -z "$1" ] && { echo "Usage: $0 logs <app-uuid>"; exit 1; }
  api_get "/applications/$1/logs" | jq
}

cmd_databases() {
  api_get "/databases" | jq
}

cmd_database() {
  [ -z "$1" ] && { echo "Usage: $0 database <uuid>"; exit 1; }
  api_get "/databases/$1" | jq
}

cmd_services() {
  api_get "/services" | jq
}

cmd_service() {
  [ -z "$1" ] && { echo "Usage: $0 service <uuid>"; exit 1; }
  api_get "/services/$1" | jq
}

cmd_projects() {
  api_get "/projects" | jq
}

cmd_project() {
  [ -z "$1" ] && { echo "Usage: $0 project <uuid>"; exit 1; }
  api_get "/projects/$1" | jq
}

cmd_resources() {
  api_get "/resources" | jq
}

cmd_deployments() {
  api_get "/deployments" | jq
}

cmd_webhook() {
  [ -z "$1" ] && { echo "Usage: $0 webhook <resource-uuid> [type]"; exit 1; }
  TYPE="${2:-application}"
  api_post "/deploy" -d "{\"resource_uuid\":\"$1\",\"type\":\"$TYPE\"}" | jq
}

# Help
cmd_help() {
  cat << EOF
Coolify API Helper

Commands:
  health              Check API health
  version             Get Coolify version
  servers             List all servers
  server <uuid>       Get server details
  apps                List all applications
  app <uuid>          Get application details
  deploy <uuid>       Deploy/start application
  restart <uuid>      Restart application
  stop <uuid>         Stop application
  logs <uuid>         Get application logs
  databases           List all databases
  database <uuid>     Get database details
  services            List all services
  service <uuid>      Get service details
  projects            List all projects
  project <uuid>      Get project details
  resources           List all resources
  deployments         List recent deployments
  webhook <uuid> [t]  Deploy via webhook (type: application|service|database)

Examples:
  ./coolify.sh health
  ./coolify.sh servers
  ./coolify.sh deploy abc123
  ./coolify.sh webhook abc123 application
EOF
}

# Main
case "${1:-help}" in
  health)      cmd_health ;;
  version)     cmd_version ;;
  servers)     cmd_servers ;;
  server)      cmd_server "$2" ;;
  apps|applications) cmd_apps ;;
  app|application)   cmd_app "$2" ;;
  deploy)      cmd_deploy "$2" ;;
  restart)     cmd_restart "$2" ;;
  stop)        cmd_stop "$2" ;;
  logs)        cmd_logs "$2" ;;
  databases)   cmd_databases ;;
  database)    cmd_database "$2" ;;
  services)    cmd_services ;;
  service)     cmd_service "$2" ;;
  projects)    cmd_projects ;;
  project)     cmd_project "$2" ;;
  resources)   cmd_resources ;;
  deployments) cmd_deployments ;;
  webhook)     cmd_webhook "$2" "$3" ;;
  help|--help|-h) cmd_help ;;
  *)           echo "Unknown command: $1"; cmd_help; exit 1 ;;
esac
