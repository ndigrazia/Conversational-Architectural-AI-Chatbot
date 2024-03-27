#! /bin/sh
ls /scripts/pandoc.css

echo "Cambiando referencias a .md.html"

# - Con este sed, se cambian todos lo links a ".md.html" ej: "(./nombre-archivo.md.html)"
find . -name "*.md" -exec sed -i 's/.md/.md.html/g' {} \;

echo "agregando . a links relativos"
# - Con este sed, se agrega el "./" inicial a la referencia de archivo ej: "(./nombre-archivo.md.pdf)"
# cuando la misma no existe
find . -name "*.md" -exec sed -i 's/(\([A-Za-z0-9\-]\+\).md.html)/(.\/\1.md.html)/g' {} \;

# copio .css
cp /scripts/pandoc.css ./

echo "generando html"
# genedo los html
ROOT_PATH=$PWD

find . -name "*.md" -execdir /scripts/script_interno_generar_html.sh {} {}.html $ROOT_PATH \;




