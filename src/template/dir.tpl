<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>
        .file-list {
            display: flex;
            flex-direction: column;
        }
    </style>
</head>
<body>
    <div class="file-list">
    {{#each files}}
        <a href="{{../dir}}/{{file}}">【{{icon}}】{{file}}</a>
    {{/each}}
    </div>
</body>
</html>