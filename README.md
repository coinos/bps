# Bitcoin proxy server

An http server with a single POST /proxy endpoint that sends RPC methods and params to bitcoin core.

By default we restrict to a short whitelist of allowed methods that core lightning needs:

      - echo
      - estimatesmartfee
      - getblock
      - getblockhash
      - getblockchaininfo
      - getnetworkinfo


# Installation

    npm i bps

# Usage
    

`cp .env.sample .env` and edit accordingly:

    RPCUSER=admin1
    RPCPASS=123
    RPCWALLET=coinos
    RPCHOST=localhost
    RPCPORT=18443

Then
    
    npm start


# Extra

Here's a bash script to get c-lightning to call https://coinos.io/proxy instead of its native bitcoin-cli:

    #!/bin/bash

    ARGS=$(echo $* | sed 's/-[^ ]\+ //')
    OPTS=$(echo $* | tr ' ' '\n' | grep '^-')
    shift $(echo $OPTS | wc -w)
    ARGN=$(echo $ARGS | wc -w)

    join_by() {
      local d=${1-} f=${2-}
      if shift 2; then
        printf %s "$f" "${@/#/$d}"
      fi
    }

    method=\"$1\"
    shift

    if test "$ARGN" = 1; then
      params=[]
    else
      params="[\"$(join_by "\",\"" $@)\"]"
    fi

    curl -s -f https://coinos.io/proxy -H "content-type: application/json" -d '{ "method": '$method', "params": '$params' }'

    if test $? = 22; then
      exit 8
    fi

To enable it, copy the script to `.lightning/bitcoin-cli` and edit `.lightning/config` to add the `bitcoin-cli` option:

    bitcoin-cli=/root/.lightning/bitcoin-cli
