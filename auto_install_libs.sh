#!/usr/bin/expect -f

# Wait enough (forever) until a long-time boot
set timeout -1

# Start the guest VM
spawn /home/zheli/qemu-2.3.0/x86_64-softmmu/qemu-system-x86_64 -hda /home/zheli/vm-node/vm/1/crete.img -m 2048 -enable-kvm -k en-us -netdev user,id=net0,hostfwd=tcp::10022-:22 -device e1000,netdev=net0 -nographic

sleep 6

spawn ssh localhost -p 10022

expect "zheli@localhost's password: "
send "test\r"

set timeout 5

expect "zheli@ubuntu:~$"
puts "\ngoing to copy from host\n"
send "scp zheli@10.0.2.2:/home/zheli/crete-run-scripts/liblist.txt .\r"

set timeout 200

expect "zheli@10.0.2.2's password:"
send "isabellalz1234!\r"

set timeout 100
expect "zheli@ubuntu:~$"
send "./auto_install_liblist.sh liblist\r"

set timeout 1000

expect "zheli@ubuntu:~$"
send "sudo shutdown -h now\r"

set timeout 1000

expect "password for zheli:"
send "test\r"

#savevm snapshot
#set timeout 20
#expect "zheli@zheli"
#sleep 20
#spawn /home/zheli/crete-build/bin/crete-qemu-2.3-system-x86_64 -hda /home/zheli/vm-node/vm/1/crete.img -m 2048 -loadvm 202011 -monitor telnet:127.0.0.1:1234,server,nowait

#sleep 25
#spawn telnet localhost 1234
#expect "(qemu)"
#send "savevm 202011\r"
#set timeout -1
#expect "(qemu)"
#sleep 5
#send "quit\r"

#sleep 25
#set timeout -1

#spawn /home/zheli/crete-build/bin/crete-dispatch -c home/zheli/crete-run-scripts/crete_dispatch_demo_distributed.xml

#sleep 10

#spawn /home/zheli/vm-node/command_start_vm-dis.sh

#sleep 10


#executing native qemu to prepare snapshot base
#spawn /home/zheli/qemu-2.3.0/x86_64-softmmu/qemu-system-x86_64 -hda /home/zheli/vm-node/vm/1/crete.img -m 2048 -k en-us -netdev user,id=net0,hostfwd=tcp::10022-:22 -device e1000,netdev=net0 -nographic -monitor telnet:127.0.0.1:1234,server,nowait

#spawn telnet 127.0.0.1 1234
#set telID $spawn_id

#set timeout -1
#expect "(qemu)"
#send "test\r"

expect eof
