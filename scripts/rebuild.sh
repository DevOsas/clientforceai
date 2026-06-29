#!/bin/bash

cd /var/www/clientforce-ui

yarn install

yarn build

# https://github.com/Unitech/pm2/issues/325#issuecomment-281580956
pm2 delete -s "Clientforce UI" || :

pm2 start yarn --interpreter bash --name "Clientforce UI" -- start

pm2 restart "Clientforce UI"
