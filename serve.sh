#!/usr/bin/env bash
# manage a local static HTTP server for the teach-anything site
# usage: ./serve.sh [start|stop|restart|status|logs|open] [--port PORT] [--host HOST]

set -euo pipefail

# ---- defaults ----
PORT=8765
HOST=127.0.0.1
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATE_DIR="${ROOT}/.trae"
PID_FILE="${STATE_DIR}/serve.pid"
LOG_FILE="${STATE_DIR}/serve.log"
SERVER_CMD=(python3 -m http.server)

# ---- arg parsing ----
ACTION=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    start|stop|restart|status|logs|open)
      ACTION="$1"; shift ;;
    --port)
      PORT="$2"; shift 2 ;;
    --host)
      HOST="$2"; shift 2 ;;
    --help|-h)
      sed -n '1,8p' "$0"; exit 0 ;;
    *)
      echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

if [[ -z "$ACTION" ]]; then
  ACTION="status"
fi

# ---- helpers ----
ensure_state_dir() {
  mkdir -p "$STATE_DIR"
}

pid_alive() {
  local pid="$1"
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

port_in_use() {
  local port="$1"
  command -v ss >/dev/null 2>&1 && ss -ltn 2>/dev/null | awk '{print $4}' | grep -Eq "[:.]${port}$" && return 0
  command -v lsof >/dev/null 2>&1 && lsof -i "tcp:${port}" -sTCP:LISTEN >/dev/null 2>&1 && return 0
  return 1
}

find_pid_by_port() {
  local port="$1"
  command -v lsof >/dev/null 2>&1 && lsof -ti "tcp:${port}" -sTCP:LISTEN 2>/dev/null | head -1
}

cleanup_stale_pid() {
  if [[ -f "$PID_FILE" ]]; then
    local pid
    pid="$(< "$PID_FILE")"
    if ! pid_alive "$pid"; then
      rm -f "$PID_FILE"
    fi
  fi
}

print_status_line() {
  local state="$1"
  local pid="${2:--}"
  echo "server : ${state}"
  echo "pid    : ${pid}"
  echo "url    : http://${HOST}:${PORT}"
  echo "root   : ${ROOT}"
  echo "log    : ${LOG_FILE}"
}

# ---- actions ----
cmd_start() {
  ensure_state_dir
  cleanup_stale_pid

  if [[ -f "$PID_FILE" ]]; then
    local pid
    pid="$(< "$PID_FILE")"
    echo "server already running (pid ${pid})"
    print_status_line "running" "$pid"
    return 0
  fi

  if port_in_use "$PORT"; then
    local pid
    pid="$(find_pid_by_port "$PORT" || true)"
    echo "port ${PORT} is already in use (pid ${pid:-unknown})" >&2
    echo "use --port to pick a different port, or run: $0 stop" >&2
    return 1
  fi

  echo "starting server on http://${HOST}:${PORT} ..."
  (
    cd "$ROOT"
    nohup "${SERVER_CMD[@]}" "$PORT" --bind "$HOST" >> "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
  )

  local pid
  pid="$(< "$PID_FILE")"

  # wait briefly for the process to bind
  local waited=0
  while (( waited < 20 )); do
    sleep 0.1
    (( waited++ ))
    port_in_use "$PORT" && break
  done

  if pid_alive "$pid" && port_in_use "$PORT"; then
    echo "server up"
    print_status_line "running" "$pid"
  else
    echo "server failed to start, check log: ${LOG_FILE}" >&2
    rm -f "$PID_FILE"
    return 1
  fi
}

cmd_stop() {
  cleanup_stale_pid

  if [[ ! -f "$PID_FILE" ]]; then
    # try to recover if a python http.server is bound but pid file lost
    local pid
    pid="$(find_pid_by_port "$PORT" || true)"
    if [[ -n "$pid" ]]; then
      echo "pid file missing but found listener on ${PORT}: pid ${pid}"
      echo "$pid" > "$PID_FILE"
    else
      echo "no server running"
      return 0
    fi
  fi

  local pid
  pid="$(< "$PID_FILE")"

  if ! pid_alive "$pid"; then
    echo "stale pid file removed (process ${pid} not alive)"
    rm -f "$PID_FILE"
    return 0
  fi

  echo "stopping server (pid ${pid}) ..."
  kill -TERM "$pid" 2>/dev/null || true

  local waited=0
  while (( waited < 30 )) && pid_alive "$pid"; do
    sleep 0.2
    (( waited++ ))
  done

  if pid_alive "$pid"; then
    echo "SIGTERM timed out, sending SIGKILL"
    kill -KILL "$pid" 2>/dev/null || true
    sleep 0.2
  fi

  rm -f "$PID_FILE"
  echo "server stopped"
}

cmd_restart() {
  cmd_stop
  sleep 0.3
  cmd_start
}

cmd_status() {
  cleanup_stale_pid

  if [[ -f "$PID_FILE" ]]; then
    local pid
    pid="$(< "$PID_FILE")"
    if pid_alive "$pid"; then
      print_status_line "running" "$pid"
      return 0
    fi
  fi

  local pid
  pid="$(find_pid_by_port "$PORT" || true)"
  if [[ -n "$pid" ]]; then
    print_status_line "running (pid file missing)" "$pid"
    return 0
  fi

  print_status_line "stopped" ""
  return 1
}

cmd_logs() {
  ensure_state_dir
  if [[ ! -f "$LOG_FILE" ]]; then
    touch "$LOG_FILE"
  fi
  tail -f "$LOG_FILE"
}

cmd_open() {
  if ! cmd_status >/dev/null 2>&1; then
    cmd_start
  fi
  local url="http://${HOST}:${PORT}"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" &>/dev/null &
  elif command -v python3 >/dev/null 2>&1; then
    python3 -m webbrowser "$url" >/dev/null 2>&1 &
  else
    echo "open ${url}"
  fi
}

# ---- dispatch ----
case "$ACTION" in
  start)   cmd_start ;;
  stop)    cmd_stop ;;
  restart) cmd_restart ;;
  status)  cmd_status ;;
  logs)    cmd_logs ;;
  open)    cmd_open ;;
  *)       echo "unknown action: $ACTION" >&2; exit 2 ;;
esac
