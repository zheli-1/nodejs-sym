#!/usr/bin/expect -f
set timeout -1

spawn /home/zheli/qemu-2.3.0/x86_64-softmmu/qemu-system-x86_64 -hda /home/zheli/vm-node/vm/1/crete.img -m 2048 -k en-us -netdev user,id=net0,hostfwd=tcp::10022-:22 -device e1000,netdev=net0 -monitor telnet:127.0.0.1:1234,server,nowait -nographic

sleep 100

spawn ssh localhost -p 10022
set timeout 3
expect "zheli@localhost's password:"
send "test\r"

set timeout 10
expect "zheli@ubuntu:~$"
send "echo test"

spawn telnet 127.0.0.1 1234
expect "(qemu)"
send "savevm 202011\r"

expect "(qemu)"
send "q\r"
expect eof
