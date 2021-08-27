#!/usr/bin/expect -f
set timeout -1

spawn rm tb-ir.txt dbg-tb-ir.txt
sleep 2

spawn rm hostfile/*
sleep 3

spawn /home/zheli/crete-build/bin/crete-qemu-2.3-system-x86_64 -hda /home/zheli/vm-node/vm/1/crete.img -m 2048 -loadvm 202011 -k en-us -netdev user,id=net0,hostfwd=tcp::10022-:22 -device e1000,netdev=net0 -monitor telnet:127.0.0.1:1234,server,nowait -nographic

sleep 10

spawn ssh localhost -p 10022
set timeout 3
expect "zheli@localhost's password:"
send "test\r"

set timeout 100
expect "zheli@ubuntu:~$"
puts "\ngoing to run crete-run\n"
send "crete-run -c auto_jstest.xml\r"

interact
