#!/bin/bash
# Prodüksiyon build'ini geçici bir portta ayağa kaldırıp kritik sayfaları doğrular.
set -u
PORT="${SMOKE_PORT:-3114}"

npx next start -p "$PORT" &> /dev/null &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null' EXIT

for i in $(seq 1 30); do
  curl -sf -o /dev/null "http://localhost:$PORT/tr" && break
  sleep 1
done

D=$(curl -s "http://localhost:$PORT/tr/pokemon/6")
echo "--- charizard (tr): tip etkilesimleri + carpanlar:"
echo "$D" | grep -o "Tip Etkileşimleri\|Zayıf olduğu\|4×\|½×" | sort -u
echo "--- charizard formlari (mega):"
echo "$D" | grep -o "Charizard Mega X\|Charizard Gmax" | sort -u
echo "--- tur bilgileri + ses:"
echo "$D" | grep -o "Yakalama oranı\|Yumurta grupları\|Çığlığını dinle" | sort -u
echo "--- hamleler:"
echo "$D" | grep -o "Hamleler\|TM/TR ile öğrenilenler" | sort -u

E=$(curl -s "http://localhost:$PORT/en/pokemon/25")
echo "--- pikachu (en) matchups:"
echo "$E" | grep -o "Weak to\|Type Matchups\|Immune to" | sort -u

echo "--- eevee evrim kosullari:"
curl -s "http://localhost:$PORT/tr/pokemon/133" | grep -o "Water Stone\|Fire Stone\|Mutluluk" | sort -u
echo "--- efsanevi rozeti (mewtwo):"
curl -s "http://localhost:$PORT/tr/pokemon/150" | grep -o "Efsanevi" | head -1
echo "--- content-visibility karti sayisi:"
curl -s "http://localhost:$PORT/tr" | grep -c "content-visibility:auto"
