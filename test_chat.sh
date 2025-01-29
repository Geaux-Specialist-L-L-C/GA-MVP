#!/bin/bash

# Get token
TOKEN=$(curl -s -X POST "https://cheshire.geaux.app/auth/token" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | jq -r .access_token)

# Test message
curl -X POST "https://cheshire.geaux.app/message" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"text":"What learning style would work best for me?"}'
