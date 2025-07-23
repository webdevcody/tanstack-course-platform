#!/bin/bash

scp -r -p -C root@$COURSE_SERVER_IP:/var/lib/docker/volumes/wdc-tanstack-starter-kit_app_files/_data/* ./backups/videos
