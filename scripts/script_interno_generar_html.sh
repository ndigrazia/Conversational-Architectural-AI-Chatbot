#/bin/bash

ROOT_PATH=$3

ROOT_PATH_COUNT=$(echo $ROOT_PATH |grep -o "/"|wc -l)
CURRRENT_PATH_COUNT=$(echo $PWD |grep -o "/"|wc -l)
RELATIVE_SLASH_COUNT=$(($CURRRENT_PATH_COUNT-$ROOT_PATH_COUNT))
echo $RELATIVE_SLASH_COUNT

RELATIVE_PATH=""
if [ $RELATIVE_SLASH_COUNT -eq 0 ]
then
  RELATIVE_PATH="."
else
  COUNT=1
  RELATIVE_PATH=".."
  while [ $COUNT -lt ${RELATIVE_SLASH_COUNT} ]
  do
    RELATIVE_PATH="${RELATIVE_PATH}/.."
    COUNT=$(($COUNT+1))
  done
fi

pandoc -t html -c $RELATIVE_PATH/pandoc.css -s $1 -o $2

