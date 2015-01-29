Handlebars.getTemplate = function (name) {
    if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
        $.ajax({
            url: '/scripts/templates/' + name + '.html',
            datatype: 'text/javascript',
            success: function (response, status, jqXHR) {
                if (Handlebars.templates === undefined) {
                    Handlebars.templates = {};
                }
                //Handlebars.templates[name] = Handlebars.compile(jqXHR.responseText);
                Handlebars.templates[name] = Handlebars.compile(response);
            },
            async: false
        });
    }
    return Handlebars.templates[name];
};

Handlebars.getExternalTemplate = function (name, externalurl) {
    if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
        $.ajax({
            url: externalurl,
            datatype: 'text/javascript',
            success: function (response, status, jqXHR) {
                if (Handlebars.templates === undefined) {
                    Handlebars.templates = {};
                }
                //Handlebars.templates[name] = Handlebars.compile(jqXHR.responseText);
                Handlebars.templates[name] = Handlebars.compile(response);
            },
            async: false
        });
    }
    return Handlebars.templates[name];
};

