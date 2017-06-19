var ui = {};

ui.create = function () {
  this.handlebars('menu', {});
};

ui.handlebars = function(page, data, template){
  var set_template = (template ? template : 'default' );
  var postTemplate = templates["JST"]["src/templates/default.hbs"]; // how do we know which template to use
  var html = postTemplate(data); // not sure what we are doing here
  this.swapContent(page, html);
};

ui.swapContent = function(page, html){
  $( ".container").replaceWith( '<div class="container">'+html+'</div>' );
};

module.exports = ui;
