
#! /bin/sh
chmod +x scripts/script_interno_generar_html.sh
chmod +x scripts/script_interno_pandoc.sh
docker run --rm --volume "./adrs:/data" --volume "./scripts:/scripts" --user `id -u`:`id -g` --entrypoint "/scripts/script_interno_pandoc.sh" pandoc/latex:latest-ubuntu
