var ui = {};

ui.init = function () {
  var data = this.getData();
  this.handlebars('menu', data );
};

ui.getData = function ( input ){
  var task = ( input ? input : 1 );
  var title = this.getPageTitle( task );

  var data = {
    page: title,
    input:[
      {title:'sun'},
      {title:'skill'},
      {title:'technology'},
      {title:'nature'},
      {title:'justice'},
      {title:'strength'},
      {title:'medicine'},
      {title:'love'},
      {title:'luck'},
      {title:'stars'},
      {title:'time'},
      {title:'magic'},
      {title:'insanity'},
      {title:'fate'},
      {title:'wealth'},
      {title:'moon'},
      {title:'beauty'},
      {title:'wine'},
      {title:'sound'}
    ],
    submit: true,
    rel: task
  };

  return data;
}

ui.getPageTitle = function ( task ){
  var title = 'Results';

  title = ( task == 1 ? 'First Tasks' : title );
  title = ( task == 2 ? 'Second Tasks' : title );
  title = ( task == 3 ? 'Third Tasks' : title );

  return title;
}

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
