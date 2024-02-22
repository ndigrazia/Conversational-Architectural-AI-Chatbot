#! /bin/sh
ls /scripts/pandoc.css

# - Con este sed, se cambian todos lo links a ".md.html" ej: "(./nombre-archivo.md.html)"
find . -name "*.md" -exec sed -i 's/.md/.md.html/g' {} \;

# - Con este sed, se agrega el "./" inicial a la referencia de archivo ej: "(./nombre-archivo.md.pdf)"
# cuando la misma no existe
find . -name "*.md" -exec sed -i 's/(\([A-Za-z0-9\-]\+\).md.html)/(.\/\1.md.html)/g' {} \;

find . -name "*.md" -execdir pandoc -t html -c /scripts/pandoc.css -s --embed-resources {} -o {}.html \;
