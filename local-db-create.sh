#!/bin/sh

psql -c 'CREATE DATABASE test_db'
psql -d test_db -f pg_schema
