#!/bin/bash
# Скрипт для запуска отдельного PostgreSQL кластера для Tamagochi

pg_ctl -D ~/postgres-tamagochi -l ~/postgres-tamagochi/logfile start
