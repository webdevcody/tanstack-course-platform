#!/bin/bash

ssh -L 5435:localhost:5432 root@$COURSE_SERVER_IP
# ssh -L 3000:localhost:3000 root@$COURSE_SERVER_IP