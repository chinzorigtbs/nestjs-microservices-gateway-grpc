#!/bin/bash

echo "======================================="
echo "Creating rabbitmq server container..."
sleep 1
docker run -d --hostname rmq --name rabbitmq -p 15672:15672 -p 5672:5672 rabbitmq:3-management-alpine
echo "Rabbitmq server has been created!"
echo "======================================="
