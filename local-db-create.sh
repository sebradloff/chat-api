#!/bin/sh

psql -c 'CREATE DATABASE test_db'
npm run build
npm run load:schema
