# DEPLOY CHANGES BEFORE RUNNING DOCKER CONTAINER
FROM ubuntu:22.04

EXPOSE 80
EXPOSE 81

RUN echo 'Verifying Ubuntu..'

RUN apt update

RUN apt install -y curl

RUN apt-get install -y python3
COPY docker/systemctl3.py /usr/bin/systemctl

RUN echo 'Installing Node..'

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash

RUN apt install -y nodejs

#RUN curl https://gist.githubusercontent.com/cornflourblue/f0abd30f47d96d6ff127fe8a9e5bbd9f/raw/e3047c9dc3ce8b796e7354c92d2c47ce61981d2f/setup-nodejs-mongodb-production-server-on-ubuntu-1804.sh | bash

RUN echo 'Misc Prerequisite Setup..'

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4

RUN curl -fsSL https://pgp.mongodb.com/server-7.0.asc |  gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

RUN echo "deb [ arch=amd64,arm64 trusted=yes ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
#RUN echo "deb [ arch=amd64,arm64 trusted=yes ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list

RUN apt-get update

RUN apt install -y mongodb-org

COPY docker/systemctl3.py /usr/bin/systemctl

RUN sed -i "s|^  bindIp:.*|  bindIp: 0.0.0.0|" /etc/mongod.conf
RUN sed -i -e "/processManagement/a\\" -e "  pidFilePath: /var/run/mongodb/mongod.pid" /etc/mongod.conf
RUN sed -i -e "/PIDFile=/a\\" -e "RuntimeDirectory=mongodb" /lib/systemd/system/mongod.service


RUN npm install pm2 -g

RUN apt-get install -y nginx

RUN apt-get install -y ufw

RUN echo 'Setting Up File Structure'

COPY /frontend /opt/front-end/

RUN npm install -g typescript

WORKDIR /opt/front-end

RUN npm install

RUN npm run build

RUN rm /etc/nginx/sites-available/default

COPY /docker/default /etc/nginx/sites-available/default

RUN service nginx restart

WORKDIR /

COPY docker/commands.sh /scripts/commands.sh
RUN ["chmod", "+x", "/scripts/commands.sh"]
ENTRYPOINT ["/scripts/commands.sh"]