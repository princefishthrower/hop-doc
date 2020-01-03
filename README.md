# Hop Doc (hop-doc.com)

This is the source code for hop-doc.com

Already done the following:

1. PDF from https://www.yakimachief.com/wp-content/uploads/Yakima-Chief-Hops-Varieties.pdf downloaded, and using https://www.pdftohtml.net/ , converted to HTML
2. HTML classes slightly simplified (due to off by 1 RGB values, but nothing more)
3. HTML compile to JSON via parser.js
4. Simple SPA using axios to load JSON with react-sematic-ui


## Run The App for Development

Run the App with . This will first Compile HTML file to JSON with `utils/parser.js`. This reads through all 137 hops

`npm run start`

## Build The App

`npm run build`