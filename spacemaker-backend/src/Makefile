# Variable to store path to project (path in docker container)
PROJECT_PATH = /home/spacemaker-api

# Variable to store project name
PROJECT_NAME = "spacemaker-api"

# Variable for file to store running process id
PID_FILE = /tmp/hyttetur-backend.pid

# We can use such syntax to get main.go and other root Go files.
GO_FILES = $(wildcard *.go)

# Start task performs "go run main.go" and writes its process id to PID_FILE
start:
	go run $(GO_FILES) & echo $$! > $(PID_FILE)

# Stop task stops process id stored in PID_FILE
# (and all child processes with pstree)
stop:
	-kill `pstree -p \`cat $(PID_FILE)\` | tr "\n" " " |sed "s/[^0-9]/ /g" |sed "s/\s\s*/ /g"`

# Before task only prints message
# Can be removed, but nice to have
before:
	@echo "Stopped $(PROJECT_NAME)" && printf '%*s\n' "40" '' | tr ' ' -

# Restart task executes stop, before and start tasks
# in strict order and prints message
restart: stop before start
	@echo "STARTED $(PROJECT_NAME)" && printf '%s\n' "40" '' | tr ' ' -

# Serve task runs fswatch monitor and performs restart task if any source file is changed.
# Before serving it executes start task
serve: start
	fswatch -or --event=Updated . | xargs -n1 -I {} make restart

# .PHONY is used for reserving tasks words
.PHONY: start stop before serve restart
