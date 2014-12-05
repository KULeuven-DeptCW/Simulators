#!/bin/bash
if [ ! -d "node_modules/jscc-node" ]; then
	npm install jscc-node
fi
cd "node_modules/jscc-node"
node jscc.js -o ../../pr-parser.js ../../pr-parser.par
