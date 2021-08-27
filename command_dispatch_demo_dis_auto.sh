#!/bin/sh
CRETE_DEV='/home/zheli/crete-build/bin'
CMAKE_INSTALL='/usr/crete-bin'

CRETEPATH=$CRETE_DEV
# CRETEPATH=$CMAKE_INSTALL

export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$CRETEPATH:/usr/local/lib:$CRETEPATH/boost

# ========================
# $CRETEPATH/crete-dispatch -c crete.ffmpeg.batch.xml
# $CRETEPATH/crete-dispatch -c crete.ffmpeg.batch.auto.xml
# ============================

# $CRETEPATH/crete-dispatch -c crete.sub_batch.xml
# $CRETEPATH/crete-dispatch -c crete.ffmpeg.xml

# $CRETEPATH/crete-dispatch -c crete.mmap.xml

# ===============================
# $CRETEPATH/crete-dispatch -c crete.coreutil.klee.xml
# $CRETEPATH/crete-dispatch -c crete.ffmpeg.batch.auto.xml
# $CRETEPATH/crete-dispatch -c crete.basetools.xml

$CRETEPATH/crete-dispatch -c /home/zheli/crete-run-scripts/crete_dispatch_demo_distributed.xml
# $CRETEPATH/crete-dispatch -c crete.dase.diff.grep.xml

# ============================
# $CRETEPATH/crete-dispatch -c crete.batch.xml

echo $CRETEPATH
