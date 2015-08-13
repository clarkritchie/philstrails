#!/bin/bash
# Usage:
# ./run.sh -- to run on port 3030
# ./run.sh -- to deploy to philstrails.meteor.com

case "$1" in
	-d)
		meteor deploy --settings settings.json philstrails.meteor.com
    ;;
	*)
		meteor --port 3030 --settings settings.json
   ;;
esac