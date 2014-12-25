#!/bin/bash
if [ ! -d "node_modules/jscc-node" ]; then
	npm install jscc-node
fi
for f in *.par
do
	cd "node_modules/jscc-node"
	bn=$(basename "$f" ".par")
	node jscc.js -o "../../$bn.js" "../../$f"
	cd ../..
done
