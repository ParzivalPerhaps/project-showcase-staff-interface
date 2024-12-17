#!/bin/bash
echo "Starting Server..."
service nginx restart
service nginx reload

sudo pm2 startup systemd
mongod --fork --logpath /var/log/mongodb.log --config /etc/mongod.conf

sudo ufw --force enable
ufw allow 22
ufw allow 'Nginx Full'

service nginx status