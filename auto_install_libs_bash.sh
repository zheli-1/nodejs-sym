#!/bin/bash
liblist=$1


# Wait enough (forever) until a long-time boot
set timeout -1

# Start the guest VM
spawn /home/zheli/qemu-2.3.0/x86_64-softmmu/qemu-system-x86_64 -hda /home/zheli/vm-node/vm/1/crete.img -m 2048 -enable-kvm -k en-us -netdev user,id=net0,hostfwd=tcp::10022-:22 -device e1000,netdev=net0 -nographic

spawn ssh localhost -p 10022

expect "zheli@localhost's password: "
send "test\r"

set timeout 5

while IFS= read -r line;
do
expect "zheli@ubuntu:~$"
puts "\ngoing to run ls\n"
send "ls\r"
send "npm install $line\r"
done < $liblist

expect "zheli@ubuntu:~$"
send "sudo shutdown -h now\r"

expect "[sudo] password for zheli:"
send "test\r"


