#!/usr/bin/expect -f
set timeout -1
spawn /home/zheli/crete-run-scripts/command_dispatch_demo_dis.sh

sleep 5

spawn /home/zheli/vm-node/command_start_vm-dis.sh

