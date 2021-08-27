#!/usr/bin/expect -f
set timeout -1
spawn /home/zheli/crete-build/bin/crete-qemu-2.3-system-x86_64 -hda /home/zheli/vm-node/vm/1/crete.img -m 2048 -loadvm 202011 -monitor telnet:127.0.0.1:1234,server,nowait

sleep 10
spawn telnet localhost 1234
expect "(qemu)"
send "savevm 202011\r"
expect "(qemu)"
send "quit\r"

#sleep 25

#spawn /home/zheli/crete-build/bin/crete-dispatch -c home/zheli/crete-run-scripts/crete_dispatch_demo_distributed.xml

#sleep 10

#spawn /home/zheli/vm-node/command_start_vm-dis.sh
expect eof
