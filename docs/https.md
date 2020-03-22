# How to get https certificate via letsencrypt

Install certbot:

    sudo apt-get install certbot

Then run command to get certificate:
    certbot certonly -d *.alice.aerem.in --manual --logs-dir certbot --config-dir certbot --work-dir certbot --agree-tos --no-bootstrap --manual-public-ip-logging-ok --preferred-challenges dns-01 --server https://acme-v02.api.letsencrypt.org/directory

Update DNS TXT record as requested.
If there are no errors and key files are generated, run

    kubectl create secret tls tls-secret --key=privkey.pem --cert=fullchain.pem

to create TLS secret.
