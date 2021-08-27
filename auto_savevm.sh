#!/usr/bin/expect -f
set timeout -1

spawn telnet 127.0.0.1 1234
expect "(qemu)"
send "savevm 202011\r"
expect "(qemu)"
send "q\r"

expect eof

